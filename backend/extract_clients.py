import sys
import os
import json
import re
from bs4 import BeautifulSoup

def clean_logo_path(src: str) -> str:
    src = src.strip().lstrip("/")
    if src.startswith("images/"):
        filename = src.split("/", 1)[-1]
        return f"clients/{filename}"
    elif src.startswith("clients/"):
        return src
    # fallback: just add clients/
    return f"clients/{os.path.basename(src)}"

def clean_client_name(name: str) -> str:
    # Remove suffixes like "Team Building Event", "Events", etc.
    suffixes = [
        r" Team Building Event$",
        r" Team Building$",
        r" Events$",
        r" Event$",
        r" Team Build$",
        r" Team Buildings$",
        r" Team Building Activities$",
    ]
    for suffix in suffixes:
        name = re.sub(suffix, "", name, flags=re.IGNORECASE)
    # Remove trailing/leading whitespace
    return name.strip()

def main(html_path, output_json):
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    clients = []
    order = 1
    seen = set()
    # Find all logo images
    for img in soup.find_all("img"):
        name = img.get("alt") or img.get("title") or None
        src = img.get("src") or ""
        if not name or not src or name.strip() == "":
            continue
        # --- CLEAN NAME! ---
        name = clean_client_name(name.strip())
        if not name:  # skip empty after cleaning
            continue
        logo = clean_logo_path(src)
        # Try to find a surrounding link
        website = ""
        parent_a = img.find_parent("a")
        if parent_a and parent_a.has_attr("href"):
            website = parent_a["href"].strip()
        # Avoid duplicates
        if name.lower() in seen:
            continue
        seen.add(name.lower())
        clients.append({
            "model": "core.client",
            "pk": order,
            "fields": {
                "name": name,
                "logo": logo,
                "website": website,
                "order": order
            }
        })
        order += 1

    # Write to JSON
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(clients, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(clients)} clients to {output_json}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python extract_clients.py <customers.htm> <output_json>")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
