from __future__ import annotations
from django.conf import settings
from django.http import HttpResponseBadRequest, JsonResponse, HttpResponseRedirect
from django.core.mail import EmailMultiAlternatives
from django.views.decorators.csrf import csrf_exempt
from .models import List, Subscriber

def _site_url() -> str:
    return getattr(settings, "SITE_URL", "").rstrip("/")

def _api_base() -> str:
    return getattr(settings, "API_BASE", "").rstrip("/")

def confirm_url(token: str) -> str:
    return f"{_api_base()}/n/public/confirm/{token}/"

@csrf_exempt
def subscribe(request):
    if request.method != "POST":
        return HttpResponseBadRequest("POST required")
    email = (request.POST.get("email") or "").strip().lower()
    list_id = request.POST.get("list")
    list_slug = (request.POST.get("list_slug") or "").strip()
    first = (request.POST.get("first_name") or "").strip()
    last = (request.POST.get("last_name") or "").strip()
    if not email:
        return HttpResponseBadRequest("email required")

    lst = None
    if list_id:
        try:
            lst = List.objects.get(id=int(list_id))
        except Exception:
            return HttpResponseBadRequest("invalid list id")
    elif list_slug:
        try:
            lst = List.objects.get(slug=list_slug)
        except List.DoesNotExist:
            return HttpResponseBadRequest("invalid list slug")
    else:
        return HttpResponseBadRequest("list or list_slug required")

    sub, created = Subscriber.objects.get_or_create(
        list=lst, email=email,
        defaults={"first_name": first, "last_name": last, "is_confirmed": False},
    )
    if first and sub.first_name != first:
        sub.first_name = first
    if last and sub.last_name != last:
        sub.last_name = last
    sub.save()

    if not sub.is_confirmed:
        subject = "Please confirm your subscription"
        html = f"""
        <div style="font-family:Arial,sans-serif">
          <h2>Confirm your subscription</h2>
          <p>Hi {sub.first_name or ''}, click below to confirm.</p>
          <p><a href="{confirm_url(sub.confirm_token)}"
                style="background:#111;color:#fff;padding:10px 14px;border-radius:8px;text-decoration:none;">
                Confirm</a></p>
        </div>
        """
        msg = EmailMultiAlternatives(subject, confirm_url(sub.confirm_token), settings.DEFAULT_FROM_EMAIL, [sub.email])
        msg.attach_alternative(html, "text/html")
        msg.send(fail_silently=False)

    return JsonResponse({"ok": True, "confirmed": sub.is_confirmed})

def confirm(request, token: str):
    try:
        sub = Subscriber.objects.get(confirm_token=token)
    except Subscriber.DoesNotExist:
        return HttpResponseBadRequest("invalid token")
    if not sub.is_confirmed:
        sub.is_confirmed = True
        sub.save(update_fields=["is_confirmed"])
    return HttpResponseRedirect(_site_url() + "/newsletter/confirmed")

def unsubscribe(request, token: str):
    try:
        sub = Subscriber.objects.get(unsubscribe_token=token)
    except Subscriber.DoesNotExist:
        return HttpResponseBadRequest("invalid token")
    if not sub.unsubscribed_at:
        from django.utils import timezone
        sub.unsubscribed_at = timezone.now()
        sub.is_confirmed = False
        sub.save(update_fields=["unsubscribed_at", "is_confirmed"])
    return HttpResponseRedirect(_site_url() + "/newsletter/unsubscribed")
