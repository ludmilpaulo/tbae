from __future__ import annotations

import io
import os
from tempfile import NamedTemporaryFile

from django.conf import settings
from django.core.management import BaseCommand, call_command, CommandError


EXCLUDES = [
    "contenttypes",
    "auth.Permission",
    "admin.LogEntry",
    "sessions",
    "authtoken",  # only if you use DRF tokens
]


class Command(BaseCommand):
    help = (
        "Copy data from a legacy SQLite DB into the default DB (MySQL on PythonAnywhere).\n"
        "Usage:\n"
        "  python manage.py migrate_sqlite_to_mysql --sqlite=/full/path/to/db.sqlite3\n\n"
        "Or set SQLITE_LEGACY_PATH env var or in settings to avoid the flag."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--sqlite",
            dest="sqlite_path",
            default=None,
            help="Full path to the legacy SQLite database file (db.sqlite3).",
        )

    def handle(self, *args, **opts):
        sqlite_path = opts.get("sqlite_path") or os.environ.get("SQLITE_LEGACY_PATH") or getattr(settings, "SQLITE_LEGACY_PATH", None)
        if not sqlite_path:
            raise CommandError("Provide --sqlite=/path/to/db.sqlite3 or set SQLITE_LEGACY_PATH.")

        # Create a temporary DB alias dynamically if not present in settings
        if "legacy_sqlite" not in settings.DATABASES:
            settings.DATABASES["legacy_sqlite"] = {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": sqlite_path,
                "OPTIONS": {"timeout": 30},
            }

        self.stdout.write(self.style.MIGRATE_HEADING(f"Dumping from {sqlite_path} (alias=legacy_sqlite)"))
        out = io.StringIO()
        call_command(
            "dumpdata",
            database="legacy_sqlite",
            format="json",
            indent=2,
            natural_foreign=True,
            natural_primary=True,
            exclude=EXCLUDES,
            stdout=out,
        )
        data = out.getvalue()
        if not data.strip():
            self.stdout.write(self.style.WARNING("No data found in legacy SQLite."))
            return

        # Ensure target schema exists
        self.stdout.write(self.style.MIGRATE_HEADING("Migrating schema on default DB (target)"))
        call_command("migrate", database="default")

        # Load into default (MySQL)
        self.stdout.write(self.style.MIGRATE_HEADING("Loading data into default DB"))
        with NamedTemporaryFile("w+", suffix=".json", delete=False) as tmp:
            tmp.write(data)
            tmp.flush()
            tmp_path = tmp.name

        try:
            call_command("loaddata", tmp_path, database="default", ignorenonexistent=True)
        finally:
            try:
                os.remove(tmp_path)
            except OSError:
                pass

        self.stdout.write(self.style.SUCCESS("Data copy completed."))
