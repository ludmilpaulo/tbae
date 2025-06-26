import os
import sys
import shutil
import json

# === CONFIGURE THESE ===
BASE_PATH = "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html"
MEDIA_CLIENTS = "/Users/ludmil/Desktop/Apps/tbae/backend/media/clients"
CLIENTS_JSON = "/Users/ludmil/Desktop/Apps/tbae/backend/clients.json"
IMAGE_DIRS = [
    os.path.join(BASE_PATH, "images"),
    os.path.join(BASE_PATH, "clients"),
]

def find_image(filename: str) -> str | None:
    for folder in IMAGE_DIRS:
        img_path = os.path.join(folder, filename)
        if os.path.exists(img_path):
            return img_path
    return None

def main():
    # Ensure media/clients exists
    os.makedirs(MEDIA_CLIENTS, exist_ok=True)

    with open(CLIENTS_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    not_found = []
    copied = 0

    for client in data:
        logo_path = client["fields"]["logo"].replace("clients/", "")
        src = find_image(logo_path)
        dest = os.path.join(MEDIA_CLIENTS, logo_path)
        if src:
            # Create target directory if not exists
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            shutil.copy2(src, dest)
            copied += 1
        else:
            not_found.append(logo_path)

    print(f"Copied {copied} images to {MEDIA_CLIENTS}")
    if not_found:
        print(f"{len(not_found)} images NOT found:")
        for nf in not_found:
            print("  ", nf)
    else:
        print("All images found and copied!")

if __name__ == "__main__":
    main()
