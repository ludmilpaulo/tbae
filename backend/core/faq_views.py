# backend/faq/views.py

from rest_framework import generics, filters
from .models import FAQ, FAQCategory
from .serializers import FAQSerializer, FAQCategorySerializer

class FAQCategoryList(generics.ListAPIView):
    queryset = FAQCategory.objects.all().order_by("order")
    serializer_class = FAQCategorySerializer

class FAQList(generics.ListAPIView):
    serializer_class = FAQSerializer

    def get_queryset(self):
        qs = FAQ.objects.filter(is_active=True)
        category_id = self.request.query_params.get("category")
        if category_id:
            qs = qs.filter(category_id=category_id)
        return qs.order_by("category__order", "order")


# backend/faqs/views.py
from rest_framework import views, status
from rest_framework.response import Response
from .models import FAQ
from .serializers import FAQSerializer
from django.core.mail import send_mail

class AskFAQView(views.APIView):
    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        question = request.data.get("question")
        # Save as pending FAQ (you might want an is_pending field, or just save as inactive)
        faq = FAQ.objects.create(
            question=question,
            answer="",  # Empty until admin fills in
            is_active=False,
        )
        # Optionally: email admin
        send_mail(
            "New FAQ Question Submitted",
            f"Name: {name}\nEmail: {email}\nQuestion: {question}",
            "no-reply@yourdomain.com",
            ["your-admin@yourdomain.com"],
        )
        return Response({"success": True}, status=status.HTTP_201_CREATED)


