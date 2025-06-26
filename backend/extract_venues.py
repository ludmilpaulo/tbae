import sys, os, json
from bs4 import BeautifulSoup

def clean_image(src):
    src = src.strip().lstrip("/")
    if src.startswith("images/"):
        return f"venues/images/{os.path.basename(src)}"
    if src.startswith("venues/images/"):
        return src
    return f"venues/images/{os.path.basename(src)}"

def main(html_files):
    provinces, towns, venues, venue_images = [], [], [], []
    prov_idx, town_idx, venue_idx, img_idx = 1, 1, 1, 1
    prov_map, town_map = {}, {}
    for html_file in html_files:
        with open(html_file, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
        # Assume province name is in title or h1, fallback to filename
        province = None
        for h in soup.find_all(["h1", "h2"]):
            if "Venues" in h.text:
                province = h.text.replace(" Venues", "").strip()
                break
        if not province:
            province = os.path.basename(html_file).split("-")[1].replace(".htm", "").replace("_", " ").title()
        if province not in prov_map:
            prov_map[province] = prov_idx
            provinces.append({
                "model": "venues.province",
                "pk": prov_idx,
                "fields": {"name": province}
            })
            prov_idx += 1
        # Find all venue blocks
        for block in soup.find_all("div", class_="venueblock"):
            # Town
            town = block.find("span", class_="town")
            town_name = town.text.strip() if town else "Unknown"
            town_key = (town_name, province)
            if town_key not in town_map:
                town_map[town_key] = town_idx
                towns.append({
                    "model": "venues.town",
                    "pk": town_idx,
                    "fields": {
                        "name": town_name,
                        "province": prov_map[province]
                    }
                })
                town_idx += 1
            # Venue name
            vname = block.find("span", class_="venuename") or block.find("h3")
            venue_name = vname.text.strip() if vname else "Unknown Venue"
            description = block.find("div", class_="description")
            desc = description.text.strip() if description else ""
            details = block.find("div", class_="details")
            det = details.text.strip() if details else ""
            # Images
            images = []
            for img in block.find_all("img"):
                img_src = img.get("src") or ""
                img_caption = img.get("alt") or ""
                images.append((img_src, img_caption))
            venues.append({
                "model": "venues.venue",
                "pk": venue_idx,
                "fields": {
                    "name": venue_name,
                    "province": prov_map[province],
                    "town": town_map[town_key],
                    "description": desc,
                    "details": det,
                    "latitude": None,
                    "longitude": None,
                    "price": None,
                }
            })
            for img_src, caption in images:
                venue_images.append({
                    "model": "venues.venueimage",
                    "pk": img_idx,
                    "fields": {
                        "venue": venue_idx,
                        "image": clean_image(img_src),
                        "caption": caption,
                        "order": img_idx
                    }
                })
                img_idx += 1
            venue_idx += 1

    # Write fixtures
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
    if len(sys.argv) < 2:
        print("Usage: python extract_venues.py venues-*.htm [teambuilding-venues.htm ...]")
        sys.exit(1)
    main(sys.argv[1:])
