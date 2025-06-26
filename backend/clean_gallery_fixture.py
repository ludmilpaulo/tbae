import json

FIXTURE_PATH = "gallery_full.json"         # Your input fixture
OUTPUT_PATH = "gallery_full_CLEAN.json"    # Cleaned fixture (safe to loaddata)
AUTO_CREATE_EVENTS = True                  # Set to False to just remove orphans

with open(FIXTURE_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

# Find all existing event PKs
event_pks = {obj["pk"] for obj in data if obj["model"] == "gallery.galleryevent"}
orphan_photos, orphan_videos = [], []

# If auto-creating, track missing event PKs
missing_event_pks = set()

cleaned = []
for obj in data:
    if obj["model"] in ["gallery.galleryphoto", "gallery.galleryvideo"]:
        event_pk = obj["fields"].get("event")
        if event_pk not in event_pks:
            if AUTO_CREATE_EVENTS:
                missing_event_pks.add(event_pk)
            else:
                # Just remove orphaned
                if obj["model"] == "gallery.galleryphoto":
                    orphan_photos.append(obj)
                else:
                    orphan_videos.append(obj)
                continue
    cleaned.append(obj)

# Auto-create stub events for missing event PKs
if AUTO_CREATE_EVENTS and missing_event_pks:
    for pk in sorted(missing_event_pks):
        cleaned.append({
            "model": "gallery.galleryevent",
            "pk": pk,
            "fields": {
                "title": f"Restored Event {pk}",
                "description": "Restored automatically due to missing parent for media.",
                "event_type": "other",
                "category": None,
                "year": 2000,
                "date": None,
                "tags": "",
                "created": "2024-01-01T00:00:00Z"
            }
        })
    print(f"Created {len(missing_event_pks)} stub events for orphaned media.")

# Save
with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    json.dump(cleaned, f, indent=2, ensure_ascii=False)

print(f"Saved cleaned fixture to {OUTPUT_PATH}")
if not AUTO_CREATE_EVENTS:
    print(f"Removed {len(orphan_photos)} orphaned photos and {len(orphan_videos)} orphaned videos.")
