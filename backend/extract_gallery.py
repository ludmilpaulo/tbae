import os
import sys
import re
import json
from bs4 import BeautifulSoup

# ========== CONFIG ==========
GALLERY_FILES = [
    "gallery.htm",
    "gallery-2012.htm",
    "gallery-2013.htm",
    "gallery-2014.htm",
    "gallery-2015.htm",
    "gallery-2016.htm",
    "gallery-2017.htm",
    "gallery-2018.htm",
    "gallery-2019.htm",
]
VIDEOS_FILE = "videos.htm"

CATEGORY_MODEL = "gallery.gallerycategory"
EVENT_MODEL = "gallery.galleryevent"
PHOTO_MODEL = "gallery.galleryphoto"
VIDEO_MODEL = "gallery.galleryvideo"

# ========== HELPERS ==========

def normalize_category(cat):
    cat = (cat or "").strip()
    if not cat:
        return "General"
    cat = re.sub(r"[^\w\s-]", "", cat)
    return cat.title()

def get_year_from_filename(fname):
    m = re.search(r"(\d{4})", fname)
    return int(m.group(1)) if m else None

def get_event_type(title, desc=""):
    title = (title or "").lower()
    desc = (desc or "").lower()
    if "outdoor" in title or "outdoor" in desc:
        return "outdoor"
    if "virtual" in title or "virtual" in desc:
        return "virtual"
    if "indoor" in title or "indoor" in desc:
        return "indoor"
    return "other"

def clean_img_src(src):
    src = src.strip().lstrip("/")
    # Only want "gallery/photos/xxx.jpg"
    if "gallery/" in src:
        return src[src.index("gallery/") :]
    elif "images/" in src:
        return "gallery/photos/" + os.path.basename(src)
    return "gallery/photos/" + os.path.basename(src)

def get_youtube_id(url):
    # Supports many YouTube URL forms
    m = re.search(
        r"(?:youtu\.be/|youtube\.com/(?:embed/|watch\?v=|v/|shorts/))([\w\-]+)", url
    )
    return m.group(1) if m else None

# ========== MAIN LOGIC ==========

def process_gallery_file(path, year=None, categories=None):
    with open(path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    events = []
    photos = []
    categories = categories or {}
    category_pk = len(categories) + 1
    event_pk = 1
    photo_pk = 1

    # Guess by h2/h3 sections and img blocks (you might need to adjust selectors)
    for section in soup.find_all(["h2", "h3"]):
        title = section.get_text(strip=True)
        # next_sibling might be a paragraph or div with description/photos
        desc = ""
        category_name = None
        year_guess = year or get_year_from_filename(path)
        # Desc
        desc_tag = section.find_next(["p", "div"])
        if desc_tag:
            desc = desc_tag.get_text(" ", strip=True)
        # Category (infer from section or desc)
        category_name = normalize_category(section.get("id") or title)
        # Event Type
        event_type = get_event_type(title, desc)
        # Category
        if category_name not in categories:
            categories[category_name] = category_pk
            category_pk += 1
        cat_pk = categories[category_name]
        # Add event
        event = {
            "model": EVENT_MODEL,
            "pk": event_pk,
            "fields": {
                "title": title,
                "description": desc,
                "event_type": event_type,
                "category": cat_pk,
                "year": year_guess or 2000,
                "date": None,
                "tags": "",
            },
        }
        # Add photos
        imgs = []
        curr = section.find_next_sibling()
        limit_photos = 40  # Safety: if too many, stop!
        while curr and limit_photos > 0:
            if curr.name == "img":
                imgs.append(curr)
            elif curr.name in ["div", "p"]:
                imgs += curr.find_all("img")
            curr = curr.find_next_sibling()
            limit_photos -= 1
        for img in imgs:
            src = img.get("src") or ""
            if not src:
                continue
            photos.append(
                {
                    "model": PHOTO_MODEL,
                    "pk": photo_pk,
                    "fields": {
                        "event": event_pk,
                        "image": clean_img_src(src),
                        "caption": img.get("alt") or "",
                        "order": photo_pk,
                    },
                }
            )
            photo_pk += 1
        events.append(event)
        event_pk += 1

    return events, photos, categories

def process_video_file(path, categories=None):
    with open(path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
    videos = []
    categories = categories or {}
    video_pk = 1
    event_pk = 10001
    for item in soup.find_all("iframe"):
        url = item.get("src")
        if "youtube" not in url:
            continue
        # Try to get title from previous sibling or alt attribute
        caption = ""
        prev = item.find_previous(["h2", "h3", "p"])
        if prev:
            caption = prev.get_text(" ", strip=True)
        event_title = "Video: " + (caption or get_youtube_id(url) or "")
        event_type = "virtual"
        # Use a common category for videos
        cat_name = "Videos"
        if cat_name not in categories:
            categories[cat_name] = max(categories.values(), default=100) + 1
        cat_pk = categories[cat_name]
        # Each video as its own event, or group by year/title if needed
        videos.append(
            {
                "model": VIDEO_MODEL,
                "pk": video_pk,
                "fields": {
                    "event": event_pk,
                    "youtube_url": url,
                    "caption": caption,
                    "order": video_pk,
                },
            }
        )
        # (If you want to create a GalleryEvent per video, add here)
        video_pk += 1
        event_pk += 1
    return videos, categories

def main():
    base_path = "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html"
    out_json = "gallery_full.json"

    all_categories = {}
    all_events = []
    all_photos = []
    all_videos = []

    for fname in GALLERY_FILES:
        fpath = os.path.join(base_path, fname)
        if not os.path.exists(fpath):
            print(f"Missing: {fname}")
            continue
        year = get_year_from_filename(fname)
        events, photos, cats = process_gallery_file(fpath, year, all_categories)
        all_events.extend(events)
        all_photos.extend(photos)
        all_categories.update(cats)

    # Videos file
    vpath = os.path.join(base_path, VIDEOS_FILE)
    if os.path.exists(vpath):
        vids, all_categories = process_video_file(vpath, all_categories)
        all_videos.extend(vids)

    # Categories fixtures
    cats_json = [
        {"model": CATEGORY_MODEL, "pk": pk, "fields": {"name": name, "display_name": name}}
        for name, pk in all_categories.items()
    ]
    fixture = cats_json + all_events + all_photos + all_videos

    # Write
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump(fixture, f, ensure_ascii=False, indent=2)
    print(f"Wrote {len(fixture)} objects to {out_json}")

if __name__ == "__main__":
    main()
