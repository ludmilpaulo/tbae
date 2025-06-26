import os
import sys
import json
from bs4 import BeautifulSoup

# ----- CONFIG -----
# Adjust these as needed for your setup
PROVINCE_FILES = [
    ("Eastern Cape", "venues-eastern-cape.htm"),
    ("Free State", "venues-free-state.htm"),
    ("Gauteng", "venues-gauteng.htm"),
    ("KwaZulu-Natal", "venues-kwazulu-natal.htm"),
    ("Limpopo", "venues-limpopo.htm"),
    ("Mpumalanga", "venues-mpumalanga.htm"),
    ("Northern Cape", "venues-northern-cape.htm"),
    ("North West", "venues-northwest.htm"),
    ("Western Cape", "venues-western-cape.htm"),
]
BASE_PATH = "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html"
MEDIA_DIR = "media/venues/images"

# These will be filled
province_map = {}  # name -> id
town_map = {}      # (name, province) -> id
venue_map = {}     # (name, town, province) -> id

provinces, towns, venues, venue_images = [], [], [], []
province_id, town_id, venue_id, image_id = 1, 1, 1, 1

def get_province_id(name):
    global province_id
    if name not in province_map:
        province_map[name] = province_id
        provinces.append({
            "model": "core.province",
            "pk": province_id,
            "fields": {"name": name}
        })
        province_id += 1
    return province_map[name]

def get_town_id(name, province_name):
    global town_id
    key = (name, province_name)
    if key not in town_map:
        town_map[key] = town_id
        towns.append({
            "model": "core.town",
            "pk": town_id,
            "fields": {"name": name, "province": get_province_id(province_name)}
        })
        town_id += 1
    return town_map[key]

def extract_venues_from_file(province_name, filename):
    global venue_id, image_id
    html_path = os.path.join(BASE_PATH, filename)
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
    # Find venue blocks
    # Each file is slightly different. Usually venues are listed in <table>, sometimes <div>s.
    # Try to find all venue tables:
    tables = soup.find_all("table")
    for table in tables:
        rows = table.find_all("tr")
        for row in rows:
            cells = row.find_all(["td", "th"])
            if len(cells) < 2:
                continue
            # First cell = maybe image, second = venue/town/desc
            town_name, venue_name, description, images = "", "", "", []
            # Try: extract town from heading above?
            # We'll try to find <b> or <h3> for town
            b = row.find("b")
            if b:
                town_name = b.text.strip()
            # Try to extract venue name, sometimes in <a>, sometimes bold, sometimes just text
            venue_link = row.find("a")
            if venue_link:
                venue_name = venue_link.text.strip()
            else:
                # Maybe the first bold
                bolds = row.find_all("b")
                if len(bolds) > 1:
                    venue_name = bolds[1].text.strip()
            # Fallback: use whole text minus image
            if not venue_name:
                texts = [t for t in row.stripped_strings]
                if texts:
                    venue_name = texts[0]
            # Description (try get all text in cell except name)
            if len(cells) > 1:
                description = " ".join([t for t in cells[1].stripped_strings if t != venue_name])
            # Images
            for img in row.find_all("img"):
                img_src = img.get("src")
                if img_src and "venues/" in img_src:
                    filename = os.path.basename(img_src)
                    images.append(filename)
            # Town fallback: Sometimes in the cell text
            if not town_name:
                # Try previous <h3> or <h2>
                prev = row.find_previous(["h2", "h3"])
                if prev:
                    town_name = prev.text.strip()
            # Clean
            venue_name = venue_name.strip().replace("\n", " ")
            town_name = town_name.strip().replace("\n", " ")
            description = description.strip()
            if not (venue_name and town_name):
                continue
            # Add venue
            v_key = (venue_name, town_name, province_name)
            if v_key in venue_map:
                continue
            venue_map[v_key] = venue_id
            venues.append({
                "model": "core.venue",
                "pk": venue_id,
                "fields": {
                    "name": venue_name,
                    "province": get_province_id(province_name),
                    "town": get_town_id(town_name, province_name),
                    "price": None,
                    "description": description,
                    "details": "",
                    "latitude": None,
                    "longitude": None
                }
            })
            # Images for venue
            for img_file in images:
                venue_images.append({
                    "model": "core.venueimage",
                    "pk": image_id,
                    "fields": {
                        "venue": venue_id,
                        "image": f"venues/images/{img_file}",
                        "caption": "",
                        "order": image_id
                    }
                })
                image_id += 1
            venue_id += 1

def main():
    for province_name, filename in PROVINCE_FILES:
        if not os.path.exists(os.path.join(BASE_PATH, filename)):
            print(f"Missing: {filename}")
            continue
        extract_venues_from_file(province_name, filename)

    # Write output files
    for name, data in [
        ("provinces.json", provinces),
        ("towns.json", towns),
        ("venues.json", venues),
        ("venue_images.json", venue_images)
    ]:
        with open(name, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Wrote {len(data)} objects to {name}")

if __name__ == "__main__":
    main()
