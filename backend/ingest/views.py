from __future__ import annotations
from datetime import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from newsletter.models import List, Subscriber

from .models import ImportJob
from .serializers import ImportJobSerializer, ImportJobCreateSerializer
from .services import process_job

import csv, io
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser

class SimpleImportView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAdminUser]

    def post(self, request):
        f = request.FILES.get("file")
        if not f:
            return Response({"detail": "file is required"}, status=400)
        list_id = request.data.get("list")
        list_slug = request.data.get("list_slug")
        create_list = request.data.get("create_list") in ("true","True","1", True)
        confirm_all = request.data.get("confirm_all") in ("true","True","1", True)
        dry_run = request.data.get("dry_run") in ("true","True","1", True)

        if not list_id and not list_slug:
            return Response({"detail": "Provide list or list_slug"}, status=400)

        if list_id:
            lst = List.objects.get(id=int(list_id))
        else:
            try:
                lst = List.objects.get(slug=list_slug)
            except List.DoesNotExist:
                if create_list:
                    lst = List.objects.create(name=list_slug, slug=list_slug)
                else:
                    return Response({"detail": "List not found"}, status=404)

        data = f.read().decode()
        reader = csv.DictReader(io.StringIO(data))
        required = {"email"}
        if not required.issubset(set(reader.fieldnames or [])):
            return Response({"detail": "CSV must include 'email' column"}, status=400)

        created = updated = skipped = errors = 0
        error_rows = []

        for i, row in enumerate(reader, start=1):
            email = (row.get("email") or "").strip().lower()
            if not email:
                errors += 1
                error_rows.append({"row": i, "error": "missing email"})
                continue

            def val(key): return (row.get(key) or "").strip()

            defaults = {
                "first_name": val("first_name"),
                "last_name": val("last_name"),
            }
            try:
                obj, is_new = Subscriber.objects.get_or_create(list=lst, email=email, defaults=defaults)
                if not is_new:
                    changed = False
                    for k, v in defaults.items():
                        if v and getattr(obj, k) != v:
                            setattr(obj, k, v); changed = True
                    if changed:
                        obj.save()
                        updated += 1
                    else:
                        skipped += 1
                else:
                    if confirm_all:
                        obj.is_confirmed = True
                        obj.save(update_fields=["is_confirmed"])
                    created += 1
            except Exception as e:
                errors += 1
                error_rows.append({"row": i, "error": str(e)})

        return Response({
            "list_id": lst.id,
            "rows_total": created + updated + skipped + errors,
            "rows_created": created,
            "rows_updated": updated,
            "rows_skipped": skipped,
            "rows_errors": errors,
            "error_report": None,  # you can write a CSV to storage and return a URL here
            "status": "completed",
            "created_at": timezone.now(),
        }, status=200)


class ImportJobViewSet(viewsets.ModelViewSet):
    queryset = ImportJob.objects.all()
    serializer_class = ImportJobSerializer
    http_method_names = ["get", "post", "head", "options"]

    def get_serializer_class(self):
        if self.action in ["create"]:
            return ImportJobCreateSerializer
        return ImportJobSerializer

    def create(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        job = ImportJob.objects.create(**ser.validated_data)
        try:
            # Try async via Celery
            from .tasks import process_job_task  # optional Celery
            process_job_task.delay(job.id)  # type: ignore[attr-defined]
            enqueued = True
        except Exception:
            process_job(job)
            enqueued = False
        return Response({"enqueued": enqueued, "job": ImportJobSerializer(job).data}, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=["get"], url_path="status")
    def status_view(self, request, pk=None):
        job = self.get_object()
        return Response(ImportJobSerializer(job).data)
