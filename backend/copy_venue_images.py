import os, shutil, json

SOURCE_DIRS = [
    "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html/images/",
    "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html/venues/images/",
    # Add more as needed
]
DEST_DIR = "./media/venues/images/"
VENUE_IMAGES_JSON = "venue_images.json"

def find_image(filename):
    for src_dir in SOURCE_DIRS:
        path = os.path.join(src_dir, filename)
        if os.path.isfile(path):
            return path
    return None

def main():
    os.makedirs(DEST_DIR, exist_ok=True)
    with open(VENUE_IMAGES_JSON, "r", encoding="utf-8") as f:
        images = json.load(f)
    copied, missing = 0, 0
    for entry in images:
        img_path = entry["fields"]["image"].replace("venues/images/", "")
        src = find_image(img_path)
        dst = os.path.join(DEST_DIR, img_path)
        if src:
            shutil.copy2(src, dst)
            copied += 1
        else:
            print(f"Missing: {img_path}")
            missing += 1
    print(f"Copied {copied} images. Missing: {missing}")

if __name__ == "__main__":
    main()
