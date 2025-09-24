from __future__ import annotations
from typing import List as TList
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import List, Subscriber, Template, Campaign
from .serializers import (
    ListSerializer, SubscriberSerializer, TemplateSerializer,
    CampaignSerializer, CampaignSendSerializer,
)
from .tasks import send_campaign_task

class ListViewSet(viewsets.ModelViewSet):
    queryset = List.objects.all().order_by("name")
    serializer_class = ListSerializer
    filterset_fields = ["slug", "name"]

class SubscriberViewSet(viewsets.ModelViewSet):
    queryset = Subscriber.objects.all().order_by("email")
    serializer_class = SubscriberSerializer
    filterset_fields = ["list", "email", "is_confirmed"]

class TemplateViewSet(viewsets.ModelViewSet):
    queryset = Template.objects.all().order_by("-updated_at")
    serializer_class = TemplateSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.select_related("list", "template").all().order_by("-id")
    serializer_class = CampaignSerializer
    filterset_fields = ["status", "list", "template", "from_email", "created_by"]

    @action(detail=True, methods=["post"], url_path="send")
    def send(self, request, pk=None):
        campaign = self.get_object()
        ser = CampaignSendSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        mode = ser.validated_data["mode"]
        sub_ids: TList[int] | None = None

        if mode == "selected":
            sub_ids = ser.validated_data["subscribers"]
            count = Subscriber.objects.filter(list=campaign.list, id__in=sub_ids).count()
            if count != len(sub_ids):
                return Response(
                    {"detail": "All selected subscribers must belong to the campaign list."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        try:
            send_campaign_task.delay(campaign.id, sub_ids)
            enqueued = True
        except Exception:
            send_campaign_task(campaign.id, sub_ids)
            enqueued = False

        return Response({"enqueued": enqueued, "campaign_id": campaign.id}, status=status.HTTP_202_ACCEPTED)
