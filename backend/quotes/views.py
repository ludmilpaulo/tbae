from rest_framework import generics, status
from rest_framework.response import Response
from .models import QuoteRequest
from .serializers import QuoteRequestSerializer
from django.core.mail import send_mail
from django.conf import settings

class QuoteRequestCreateView(generics.CreateAPIView):
    queryset = QuoteRequest.objects.all()
    serializer_class = QuoteRequestSerializer

    def create(self, request, *args, **kwargs):
        # Simple spam honeypot check
        if request.data.get("spam", "").strip():
            return Response({"error": "Spam detected."}, status=status.HTTP_400_BAD_REQUEST)
        
        response = super().create(request, *args, **kwargs)

        # Send notification email (optional)
        quote = self.get_queryset().last()
        if quote:
            send_mail(
                "New Quote Request Received",
                f"""
                Name: {quote.name}
                Company: {quote.company}
                Email: {quote.email}
                Phone: {quote.phone}
                Event Type: {quote.event_type}
                Venue: {quote.venue}
                Date: {quote.date}
                Message:
                {quote.message}
                """,
                settings.DEFAULT_FROM_EMAIL,
                [settings.DEFAULT_FROM_EMAIL],  # Set your recipient here!
                fail_silently=True
            )

        return response
