import os
import shutil
import json

BASE_PATH = "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html"
MEDIA_TARGET = "/Users/ludmil/Desktop/Apps/tbae/backend/media/venues/images"
VENUE_IMAGES_JSON = "venue_images.json"

def main():
    os.makedirs(MEDIA_TARGET, exist_ok=True)
    with open(VENUE_IMAGES_JSON, "r", encoding="utf-8") as f:
        images = json.load(f)
    copied, missing = 0, 0
    for obj in images:
        rel_img = obj["fields"]["image"].replace("venues/images/", "")
        possible_locations = [
            os.path.join(BASE_PATH, "venues/images", rel_img),
            os.path.join(BASE_PATH, "images/venues", rel_img),
            os.path.join(BASE_PATH, "venues", rel_img),
            os.path.join(BASE_PATH, rel_img),
        ]
        found = None
        for loc in possible_locations:
            if os.path.isfile(loc):
                found = loc
                break
        if found:
            shutil.copy2(found, os.path.join(MEDIA_TARGET, rel_img))
            copied += 1
        else:
            print(f"Missing: {rel_img}")
            missing += 1
    print(f"Copied {copied} images, {missing} missing.")

if __name__ == "__main__":
    main()
