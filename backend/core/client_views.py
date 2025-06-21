# core/views.py
from rest_framework import generics
from .models import Client
from .serializers import ClientSerializer

class ClientListAPIView(generics.ListAPIView):
    queryset = Client.objects.filter().order_by("order", "name")
    serializer_class = ClientSerializer
