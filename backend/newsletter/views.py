from __future__ import annotations

from typing import Optional, List as TList

from django.db.models import Count
from django.http import HttpResponse, HttpResponseRedirect, HttpResponseNotFound
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .filters import CampaignFilter, SubscriberFilter
from .models import List, Subscriber, Template, Campaign, Delivery, ImportJob
from .serializers import (
    ListSerializer, SubscriberSerializer, TemplateSerializer,
    CampaignSerializer, CampaignSendSerializer, ImportJobSerializer
)
from .tasks import send_campaign_task, process_import_job

# ----------------- Lists -----------------

class ListViewSet(viewsets.ModelViewSet):
    queryset = List.objects.all().annotate(subscribers_count=Count("subscribers"))
    serializer_class = ListSerializer
    permission_classes = [AllowAny]
    filterset_fields = ["slug", "name"]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user)

# --------------- Subscribers -------------

class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all().order_by("email")
    serializer_class = SubscriberSerializer
    permission_classes = [AllowAny]
    filterset_class = SubscriberFilter

    @action(detail=True, methods=["post"], url_path="unsubscribe", permission_classes=[AllowAny])
    def unsubscribe(self, request, pk=None):
        sub = self.get_object()
        sub.unsubscribed_at = timezone.now()
        sub.is_confirmed = False
        sub.save(update_fields=["unsubscribed_at", "is_confirmed"])
        return Response({"status": "unsubscribed"})

# ---------------- Templates --------------

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all().order_by("-updated_at")
    serializer_class = TemplateSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user)

# ---------------- Campaigns --------------

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = (
        Campaign.objects.select_related("list", "template")
        .all().annotate(deliveries_count=Count("deliveries"))
        .order_by("-id")
    )
    serializer_class = CampaignSerializer
    permission_classes = [AllowAny]
    filterset_class = CampaignFilter

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(created_by=user)

    @action(detail=True, methods=["post"], url_path="send", permission_classes=[AllowAny])
    def send(self, request, pk=None):
        campaign = self.get_object()
        ser = CampaignSendSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        mode = ser.validated_data["mode"]
        sub_ids: Optional[TList[int]] = ser.validated_data.get("subscribers") if mode == "selected" else None

        if sub_ids:
            count = Subscriber.objects.filter(list=campaign.list, id__in=sub_ids).count()
            if count != len(sub_ids):
                return Response({"detail": "All selected subscribers must belong to the campaign list."}, status=400)

        try:
            send_campaign_task.delay(campaign.id, sub_ids)
            enqueued = True
        except Exception:
            send_campaign_task(campaign.id, sub_ids)
            enqueued = False

        return Response({"enqueued": enqueued, "campaign_id": campaign.id}, status=202)

# ------------- Public endpoints ----------

@api_view(["GET"])
@permission_classes([AllowAny])
def unsubscribe_public(request, token: str):
    try:
        s = Subscriber.objects.get(unsubscribe_token=token)
    except Subscriber.DoesNotExist:
        return HttpResponseNotFound("Invalid unsubscribe token.")
    if not s.unsubscribed_at:
        s.unsubscribed_at = timezone.now()
        s.is_confirmed = False
        s.save(update_fields=["unsubscribed_at", "is_confirmed"])
    return HttpResponse("<h3>You have been unsubscribed.</h3>", content_type="text/html")


@api_view(["GET"])
@permission_classes([AllowAny])
def track_open(request, token: str):
    try:
        d = Delivery.objects.select_related("campaign").get(token=token)
        if d.opened_at is None:
            d.opened_at = timezone.now()
            d.save(update_fields=["opened_at"])
    except Delivery.DoesNotExist:
        pass
    # 1x1 transparent gif
    pixel = (
        b"GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00"
        b"\xff\xff\xff!\xf9\x04\x01\x00\x00\x00\x00,\x00"
        b"\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;"
    )
    return HttpResponse(pixel, content_type="image/gif")


@api_view(["GET"])
@permission_classes([AllowAny])
def track_click(request, token: str):
    url = request.GET.get("u")
    if not url:
        return Response({"detail": "Missing target URL"}, status=400)
    try:
        d = Delivery.objects.get(token=token)
        d.unique_clicks = (d.unique_clicks or 0) + 1
        if d.clicked_at is None:
            d.clicked_at = timezone.now()
        d.save(update_fields=["unique_clicks", "clicked_at"])
    except Delivery.DoesNotExist:
        pass
    return HttpResponseRedirect(url)

# -------- Import jobs API for UI --------

class ImportJobViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ImportJob.objects.all().order_by("-id")
    serializer_class = ImportJobSerializer
    permission_classes = [AllowAny]


class ImportCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        f = request.FILES.get("file")
        if not f:
            return Response({"detail": "file is required"}, status=400)

        list_id = request.data.get("list")
        list_slug = request.data.get("list_slug")
        confirm_all = str(request.data.get("confirm_all", "true")).lower() in ("1", "true", "yes")
        note = (request.data.get("note") or "").strip()

        if not (list_id or list_slug):
            return Response({"detail": "Provide list or list_slug"}, status=400)
        if list_id:
            lst = List.objects.get(id=int(list_id))
        else:
            lst = List.objects.get(slug=list_slug)

        job = ImportJob.objects.create(
            list=lst,
            created_by=(request.user if request.user.is_authenticated else None),
            note=note,
            status="pending",
        )
        csv_text = f.read().decode()

        try:
            process_import_job.delay(job.id, csv_text=csv_text, confirm_all=confirm_all)
            enqueued = True
        except Exception:
            process_import_job(job.id, csv_text=csv_text, confirm_all=confirm_all)
            enqueued = False

        # Your UI expects { job } immediately
        return Response({"job": ImportJobSerializer(job).data, "enqueued": enqueued}, status=201)
