from rest_framework import generics, status
from rest_framework.response import Response
from .models import ContactRequest
from .serializers import ContactRequestSerializer
from django.core.mail import send_mail
from django.conf import settings

class ContactRequestCreateView(generics.CreateAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        # Send an email to admin and confirmation to user
        send_mail(
            subject="New Contact Request - TBAE",
            message=f"""
            Name: {instance.name}
            Email: {instance.email}
            Phone: {instance.phone}
            Message: {instance.message}
            """,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.DEFAULT_FROM_EMAIL],  # Add your support email
        )
