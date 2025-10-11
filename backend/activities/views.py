from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import viewsets
from .models import Activity, ActivityCategory, Brochure
from .serializers import (
    ActivitySerializer,
    ActivityCategorySerializer,
    BrochureSerializer,
)


class ActivityCategoryViewSet(viewsets.ModelViewSet):
    queryset = ActivityCategory.objects.all()
    serializer_class = ActivityCategorySerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all().select_related("category")
    serializer_class = ActivitySerializer
    lookup_field = "slug"

    def get_queryset(self):
        queryset = super().get_queryset()
        cat = self.request.query_params.get("category")
        if cat:
            queryset = queryset.filter(category__slug=cat)
        return queryset


class BrochureViewSet(viewsets.ModelViewSet):
    queryset = Brochure.objects.all().order_by("-uploaded_at")
    serializer_class = BrochureSerializer


class LatestBrochureView(APIView):
    def get(self, request):
        latest = Brochure.objects.order_by("-uploaded_at").first()
        if latest:
            return Response(
                BrochureSerializer(latest, context={"request": request}).data
            )
        return Response({"detail": "No brochure found."}, status=404)
