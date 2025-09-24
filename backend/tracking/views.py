from __future__ import annotations
from base64 import b64decode
from urllib.parse import unquote
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseRedirect
from django.utils import timezone
from django.shortcuts import get_object_or_404
from newsletter.models import Delivery
from .models import Open, Click

_PNG = b64decode(b"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=")

def open_pixel(request, token: str):
    d = get_object_or_404(Delivery, token=token)
    if not d.opened_at:
        d.opened_at = timezone.now()
        d.save(update_fields=["opened_at"])
        Open.objects.get_or_create(delivery=d, defaults={"ts": d.opened_at})
    return HttpResponse(_PNG, content_type="image/png")

def click_redirect(request, token: str):
    d = get_object_or_404(Delivery, token=token)
    target = request.GET.get("u")
    if not target:
        return HttpResponseBadRequest("missing url")
    try:
        url = unquote(target)
    except Exception:
        url = target
    now = timezone.now()
    if not d.clicked_at:
        d.clicked_at = now
        d.save(update_fields=["clicked_at"])
    Click.objects.create(delivery=d, url=url, ts=now)
    d.unique_clicks = (d.unique_clicks or 0) + 1
    d.save(update_fields=["unique_clicks"])
    return HttpResponseRedirect(url)
