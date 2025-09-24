from __future__ import annotations
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import ImportJob
from .serializers import ImportJobSerializer, ImportJobCreateSerializer
from .services import process_job

class ImportJobViewSet(viewsets.ModelViewSet):
    queryset = ImportJob.objects.all()
    serializer_class = ImportJobSerializer
    http_method_names = ["get", "post", "head", "options"]

    def get_serializer_class(self):
        if self.action in ["create"]:
            return ImportJobCreateSerializer
        return ImportJobSerializer

    def create(self, request, *args, **kwargs):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        job = ImportJob.objects.create(**ser.validated_data)
        try:
            # Try async via Celery
            from .tasks import process_job_task  # optional Celery
            process_job_task.delay(job.id)  # type: ignore[attr-defined]
            enqueued = True
        except Exception:
            process_job(job)
            enqueued = False
        return Response({"enqueued": enqueued, "job": ImportJobSerializer(job).data}, status=status.HTTP_202_ACCEPTED)

    @action(detail=True, methods=["get"], url_path="status")
    def status_view(self, request, pk=None):
        job = self.get_object()
        return Response(ImportJobSerializer(job).data)
