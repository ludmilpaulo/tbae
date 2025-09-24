from __future__ import annotations
from typing import Iterable, List as TList
from django.db import transaction
from django.utils import timezone

from .models import Campaign, Subscriber, Delivery
from .emailing import make_email
from .utils_tracking import rewrite_html_with_tracking

try:
    from celery import shared_task
except Exception:
    def shared_task(fn):  # type: ignore
        return fn

def _iter_subscribers(campaign: Campaign, subscriber_ids: TList[int] | None) -> Iterable[Subscriber]:
    qs = Subscriber.objects.filter(list=campaign.list, is_confirmed=True, unsubscribed_at__isnull=True)
    if subscriber_ids:
        qs = qs.filter(id__in=subscriber_ids)
    return qs.iterator()

@shared_task
def send_campaign_task(campaign_id: int, subscriber_ids: TList[int] | None = None) -> dict:
    camp = Campaign.objects.select_related("list", "template").get(id=campaign_id)
    tmpl = camp.template
    subs = list(_iter_subscribers(camp, subscriber_ids))
    if not subs:
        return {"campaign_id": campaign_id, "sent": 0, "filtered": bool(subscriber_ids)}

    deliveries: list[Delivery] = []
    with transaction.atomic():
        for s in subs:
            deliveries.append(Delivery.objects.create(campaign=camp, subscriber=s))

    sent = 0
    for d in deliveries:
        s = d.subscriber
        html = rewrite_html_with_tracking(tmpl.html, d)
        try:
            msg = make_email(
                subject=tmpl.subject,
                html=html,
                to_email=s.email,
                from_email=camp.from_email,
                context={
                    "first_name": s.first_name or "",
                    "last_name": s.last_name or "",
                    "email": s.email,
                    "list_name": camp.list.name,
                    "campaign_name": camp.name,
                },
            )
            msg_id = msg.send(fail_silently=False)
            d.message_id = str(msg_id)
            d.sent_at = timezone.now()
            d.save(update_fields=["message_id", "sent_at"])
            sent += 1
        except Exception:
            # Log in production; optionally set bounce_reason.
            pass

    if camp.status != Campaign.CANCELLED:
        camp.status = Campaign.SENT
        camp.save(update_fields=["status"])

    return {"campaign_id": campaign_id, "sent": sent, "filtered": bool(subscriber_ids)}

# Optional compatibility alias if old code imports send_campaign
send_campaign = send_campaign_task
