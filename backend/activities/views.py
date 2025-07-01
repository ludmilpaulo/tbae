# activities/views.py

from rest_framework import viewsets
from .models import Activity, ActivityCategory
from .serializers import ActivitySerializer, ActivityCategorySerializer

class ActivityCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityCategory.objects.all()
    serializer_class = ActivityCategorySerializer

class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Activity.objects.all().select_related("category")
    serializer_class = ActivitySerializer
    lookup_field = "slug"

    def get_queryset(self):
        queryset = super().get_queryset()
        cat = self.request.query_params.get("category")
        if cat:
            queryset = queryset.filter(category__slug=cat)
        return queryset
