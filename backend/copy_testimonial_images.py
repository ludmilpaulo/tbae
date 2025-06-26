import os
import shutil
import json

# ---- CONFIG ----
# Where your testimonials.json is
TESTIMONIALS_JSON = "/Users/ludmil/Desktop/Apps/tbae/backend/testimonials.json"

# Where to put images for Django
DEST_FOLDER = "/Users/ludmil/Desktop/Apps/tbae/backend/media/testimonials"

# Where to search for images
SOURCE_FOLDERS = [
    "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html/images",
    "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html/testimonials/images",
    "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html/clients/images",
    "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html/testimonials",
]

def find_image(filename: str) -> str | None:
    """Try to locate the image in the listed source folders."""
    for folder in SOURCE_FOLDERS:
        candidate = os.path.join(folder, filename)
        if os.path.isfile(candidate):
            return candidate
    return None

def main():
    os.makedirs(DEST_FOLDER, exist_ok=True)

    with open(TESTIMONIALS_JSON, "r", encoding="utf-8") as f:
        testimonials = json.load(f)

    missing, copied = 0, 0

    for t in testimonials:
        img_field = t["fields"].get("avatar") or t["fields"].get("image")
        if not img_field:
            continue
        filename = os.path.basename(img_field)
        src_path = find_image(filename)
        dest_path = os.path.join(DEST_FOLDER, filename)
        if src_path:
            shutil.copy2(src_path, dest_path)
            print(f"Copied: {filename}")
            copied += 1
        else:
            print(f"Missing: {filename}")
            missing += 1

    print(f"\nCopied {copied} images to {DEST_FOLDER}")
    if missing:
        print(f"{missing} images were missing and not copied.")

if __name__ == "__main__":
    main()
