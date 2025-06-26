import os
import json
import shutil

FIXTURE_PATH = "gallery_full_CLEAN.json"
MEDIA_ROOT = "/Users/ludmil/Desktop/Apps/tbae/backend/media"
SOURCE_FOLDERS = [
    "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html/images",
    "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html/gallery/photos",
    # Add more if you have other folders!
]

def find_source(filename):
    for folder in SOURCE_FOLDERS:
        candidate = os.path.join(folder, filename)
        if os.path.exists(candidate):
            return candidate
    return None

with open(FIXTURE_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

media_files = set()
for obj in data:
    if obj["model"] == "gallery.galleryphoto":
        img_path = obj["fields"]["image"]
        fname = os.path.basename(img_path)
        dest = os.path.join(MEDIA_ROOT, "gallery/photos", fname)
        src = find_source(fname)
        if src:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.copy2(src, dest)
            media_files.add(fname)
        else:
            print(f"Missing image: {fname}")
    # You can also handle video files (if they are not just YouTube links)
    # For galleryvideo, usually only youtube_url, so no file to copy

print(f"Copied {len(media_files)} gallery images to media/gallery/photos/")
