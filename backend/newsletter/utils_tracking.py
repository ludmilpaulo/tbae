from __future__ import annotations
from urllib.parse import quote
from bs4 import BeautifulSoup
from django.conf import settings
from .models import Delivery

def _api_base() -> str:
    return getattr(settings, "API_BASE", "").rstrip("/")

def tracking_click_url(token: str, target: str) -> str:
    return f"{_api_base()}/t/c/{token}/?u={quote(target, safe='')}"

def tracking_open_url(token: str) -> str:
    return f"{_api_base()}/t/o/{token}.png"

def rewrite_html_with_tracking(html: str, delivery: Delivery) -> str:
    soup = BeautifulSoup(html or "", "html.parser")
    for a in soup.find_all("a", href=True):
        href = a.get("href")
        if href and href.startswith("http"):
            a["href"] = tracking_click_url(delivery.token, href)

    # Open pixel
    img_tag = soup.new_tag("img", src=tracking_open_url(delivery.token))
    img_tag["alt"] = ""
    img_tag["style"] = "width:1px;height:1px;border:0;display:block;opacity:0;"
    if soup.body:
        soup.body.append(img_tag)
    else:
        soup.append(img_tag)

    # Unsubscribe footer
    footer = soup.new_tag("p")
    footer["style"] = "font-size:12px;color:#666;margin-top:16px"
    unsub = soup.new_tag("a", href=f"{_api_base()}/n/public/unsubscribe/{delivery.subscriber.unsubscribe_token}/")
    unsub.string = "Unsubscribe"
    footer.append("Don’t want these emails? ")
    footer.append(unsub)
    footer.append(".")
    if soup.body:
        soup.body.append(footer)
    else:
        soup.append(footer)

    return str(soup)
