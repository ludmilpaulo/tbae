import sys
import os
import json
import re
from bs4 import BeautifulSoup

def clean_img_src(src):
    src = src.strip().lstrip("/")
    if src.startswith("clients/images/") or src.startswith("images/"):
        filename = src.split("/")[-1]
        return f"testimonials/{filename}"
    return f"testimonials/{os.path.basename(src)}"

def clean_name_company(raw: str):
    # Often "Name, Company" or "Name - Company"
    # Remove html tags and decode entities
    txt = re.sub(r"<[^>]+>", "", raw)
    txt = txt.replace("&nbsp;", " ").strip()
    # Try split on comma or dash
    name, company = txt, ""
    if "," in txt:
        parts = txt.split(",", 1)
        name = parts[0].strip()
        company = parts[1].strip()
    elif " - " in txt:
        parts = txt.split(" - ", 1)
        name = parts[0].strip()
        company = parts[1].strip()
    return name, company

def main(html_path, output_json):
    with open(html_path, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f, "html.parser")

    testimonials = []
    order = 1

    # Find all <p> tags that have an <img> as first/only child or just before the testimonial text
    ps = soup.find_all("p")
    for i, p in enumerate(ps):
        img = p.find("img")
        if not img or not img.get("src"):
            continue  # Only testimonials with images for "avatar"
        avatar = clean_img_src(img["src"])
        # Try to find the next <p> (should contain testimonial + <em>)
        # Sometimes the image is in the same <p> as the testimonial text
        # Sometimes it's next <p>
        feedback, name, company = "", "", ""
        next_p = None
        if p.text.strip().replace("\n", "") == "":  # if this <p> is only image
            # The actual testimonial is in the next <p>
            if i+1 < len(ps):
                next_p = ps[i+1]
        else:
            next_p = p

        # Extract feedback and signature from next_p
        if next_p:
            # Feedback is text before <em>
            raw_html = str(next_p)
            # Remove <img> if still present
            raw_html = re.sub(r'<img[^>]*>', '', raw_html)
            em_match = re.search(r'<em>(.*?)</em>', raw_html, re.DOTALL)
            if em_match:
                feedback = BeautifulSoup(raw_html.split('<em>')[0], "html.parser").get_text(" ", strip=True)
                signature = em_match.group(1)
                name, company = clean_name_company(signature)
            else:
                # Try to split by dash or comma at the end if <em> not present
                txt = BeautifulSoup(raw_html, "html.parser").get_text(" ", strip=True)
                m = re.match(r'(.+?)[\s\-–]+([A-Z][a-z]+.+)$', txt)
                if m:
                    feedback = m.group(1).strip()
                    company = m.group(2).strip()
                    name = ""
                else:
                    feedback = txt
                    name, company = "", ""
        if not feedback or not (name or company):
            continue  # Skip if not enough info

        testimonials.append({
            "model": "core.testimonial",
            "pk": order,
            "fields": {
                "name": name,
                "company": company,
                "text": feedback,
                "feedback": feedback,
                "avatar": avatar,
                "image": avatar
            }
        })
        order += 1

    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(testimonials, f, indent=2, ensure_ascii=False)
    print(f"Wrote {len(testimonials)} testimonials to {output_json}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python extract_testimonials.py testimonials.htm testimonials.json")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
