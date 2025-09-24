from __future__ import annotations

from urllib.parse import quote

from bs4 import BeautifulSoup
from django.conf import settings


def absolute_base() -> str:
    return getattr(settings, "NEWSLETTER_BASE_URL", "http://localhost:8000").rstrip("/")


def inject_tracking(html: str, delivery_id: int) -> str:
    """
    Adds:
    - Open pixel: GET {base}/t/open/{delivery_id}.png
    - Rewrites <a href="..."> to {base}/t/click/?d=<id>&url=<encoded>
    """
    soup = BeautifulSoup(html, "html.parser")

    # Links
    for a in soup.find_all("a"):
        href = a.get("href")
        if not href:
            continue
        track_url = f"{absolute_base()}/t/click/?d={delivery_id}&url={quote(href, safe='')}"
        a["href"] = track_url

    # Open pixel
    pixel = soup.new_tag("img")
    pixel["src"] = f"{absolute_base()}/t/open/{delivery_id}.png"
    pixel["width"] = "1"
    pixel["height"] = "1"
    pixel["style"] = "display:none"
    soup.append(pixel)

    return str(soup)
