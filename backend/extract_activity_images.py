import fitz  # PyMuPDF
import os

PDF = "TBAE  Brochure 20024.4_compressed (1).pdf"
OUTPUT = "media/activities/images/"
os.makedirs(OUTPUT, exist_ok=True)

# Example mapping: { page_number: "activity-image-name.jpg", ... }
mapping = {
    7: "amazing-race.jpg",
    8: "treasure-hunt.jpg",
    9: "cultural-games.jpg",
    10: "team-olympics.jpg",
    11: "survivor-challenge.jpg",
    12: "movie-making.jpg",
    13: "drumming-circle.jpg",
    14: "art-workshop.jpg",
    15: "masterchef-challenge.jpg",
    16: "charity-bike-build.jpg",
    17: "potjiekos-competition.jpg",
    18: "minute-to-win-it.jpg",
    19: "quiz-show.jpg",
    20: "laughter-games.jpg",
    21: "soap-box-derby.jpg",
    22: "box-cart-building.jpg",
    23: "murder-mystery.jpg",
    24: "virtual-escape-room.jpg",
    25: "the-great-escape.jpg",
    26: "problem-solving-olympics.jpg",
    27: "corporate-fun-day.jpg",
    28: "build-a-bridge.jpg",
    29: "team-songwriting.jpg",
    30: "puzzle-challenge.jpg",
    31: "giant-board-games.jpg",
    32: "dance-off.jpg",
    33: "apprentice-challenge.jpg",
    34: "marshmallow-challenge.jpg",
    35: "wine-blending.jpg",
    36: "outdoor-survivor.jpg",
    37: "talent-show.jpg"
    # Add more mappings based on the JSON list and actual brochure
}

doc = fitz.open(PDF)

for page_num, image_name in mapping.items():
    page = doc[page_num - 1]  # Pages are 0-indexed
    img_list = page.get_images(full=True)
    if not img_list:
        print(f"No image on page {page_num}")
        continue
    xref = img_list[0][0]  # get first image
    base_image = doc.extract_image(xref)
    img_bytes = base_image["image"]
    ext = base_image["ext"]
    out_path = os.path.join(OUTPUT, image_name)
    with open(out_path, "wb") as f:
        f.write(img_bytes)
    print(f"Extracted: {image_name}")

print("Done! Place all images under `media/activities/images/` for Django.")
