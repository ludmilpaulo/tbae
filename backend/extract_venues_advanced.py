import os
import re
import json
from bs4 import BeautifulSoup

PUBLIC_HTML = "/Users/ludmil/Desktop/Apps/tbae.co.za/public_html/"
PROVINCE_FILES = [
    "venues-gauteng.htm",
    "venues-eastern-cape.htm",
    "venues-free-state.htm",
    "venues-kwazulu-natal.htm",
    "venues-limpopo.htm",
    "venues-mpumalanga.htm",
    "venues-northern-cape.htm",
    "venues-northwest.htm",
    "venues-western-cape.htm",
]

def slugify(text):
    return re.sub(r'\W+', '-', text.lower()).strip('-')

def extract_town_links(province_file):
    """Find all linked town venue pages in a province HTML file."""
    path = os.path.join(PUBLIC_HTML, province_file)
    if not os.path.exists(path):
        print(f"Missing: {province_file}")
        return []
    with open(path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
    # Find all <a href="...-teambuilding.htm">
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.endswith("-teambuilding.htm") and not href.startswith("http"):
            links.append(href)
    return sorted(set(links))

def extract_venues_from_town(town_file, province_name):
    path = os.path.join(PUBLIC_HTML, town_file)
    if not os.path.exists(path):
        print(f"Missing: {town_file}")
        return []
    with open(path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")
    venues = []
    # This logic may need to adapt to actual file layout:
    # Look for <h2>, <h3>, <strong>, etc as venue names
    for h in soup.find_all(['h2', 'h3', 'strong']):
        venue_name = h.text.strip()
        if not venue_name or "venue" not in venue_name.lower():
            continue
        # Find the next <p> for description
        desc = ""
        nxt = h.find_next(['p', 'div'])
        if nxt:
            desc = nxt.text.strip()
        venues.append({
            "name": venue_name,
            "province": province_name,
            "town": town_file.split('-')[0].capitalize(),
            "description": desc,
            # More fields can be parsed here if available
        })
    return venues

def main():
    provinces = []
    towns = []
    venues = []
    province_map = {}
    town_map = {}
    venue_id = 1
    province_id = 1
    town_id = 1

    for provfile in PROVINCE_FILES:
        provname = provfile.replace("venues-", "").replace(".htm", "").replace("-", " ").title()
        province_slug = slugify(provname)
        provinces.append({"model": "venues.province", "pk": province_id, "fields": {"name": provname}})
        province_map[provname] = province_id

        town_files = extract_town_links(provfile)
        for tf in town_files:
            townname = tf.split("-")[0].capitalize()
            towns.append({"model": "venues.town", "pk": town_id, "fields": {"name": townname, "province": province_id}})
            town_map[(townname, provname)] = town_id

            town_venues = extract_venues_from_town(tf, provname)
            for v in town_venues:
                venues.append({
                    "model": "venues.venue",
                    "pk": venue_id,
                    "fields": {
                        "name": v["name"],
                        "province": province_id,
                        "town": town_id,
                        "description": v.get("description", ""),
                        "details": "",
                        "price": None,
                        "latitude": None,
                        "longitude": None,
                    }
                })
                venue_id += 1
            town_id += 1
        province_id += 1

    # Write to JSON
    for name, objs in [("provinces.json", provinces), ("towns.json", towns), ("venues.json", venues)]:
        with open(name, "w", encoding="utf-8") as f:
            json.dump(objs, f, indent=2, ensure_ascii=False)
        print(f"Wrote {len(objs)} objects to {name}")

if __name__ == "__main__":
    main()
