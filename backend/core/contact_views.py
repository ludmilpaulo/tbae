

STAFF_EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Contact Request - TBAE</title>
    <style>
        body {{ font-family: Arial, sans-serif; background: #f9f9f9; color: #222; }}
        .container {{ background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); max-width: 600px; margin: 32px auto; }}
        .header {{ border-bottom: 2px solid #2e3192; margin-bottom: 24px; }}
        .title {{ color: #2e3192; font-size: 22px; margin: 0 0 8px 0; }}
        .label {{ font-weight: bold; color: #2e3192; }}
        .footer {{ margin-top: 32px; font-size: 13px; color: #888; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 class="title">New Contact Request Received</h2>
        </div>
        <p>Hello Team,</p>
        <p>You have received a new contact request via the TBAE website. Here are the details:</p>
        <table cellpadding="6" cellspacing="0" style="font-size: 16px;">
            <tr>
                <td class="label">Name:</td>
                <td>{name}</td>
            </tr>
            <tr>
                <td class="label">Email:</td>
                <td>{email}</td>
            </tr>
            <tr>
                <td class="label">Phone:</td>
                <td>{phone}</td>
            </tr>
            <tr>
                <td class="label">Message:</td>
                <td>{message}</td>
            </tr>
        </table>
        <div class="footer">
            <p>This message was sent from the TBAE website contact form.</p>
        </div>
    </div>
</body>
</html>
"""

USER_CONFIRMATION_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thank You for Contacting TBAE</title>
    <style>
        body {{ background: #f9f9f9; font-family: Arial, sans-serif; color: #222; }}
        .container {{ max-width: 600px; margin: 32px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(46,49,146,0.10); padding: 36px 28px; }}
        .header {{ text-align: center; margin-bottom: 24px; }}
        .logo {{
            width: 68px; height: 68px; background: #2e3192;
            border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto;
        }}
        .logo-text {{ color: #fff; font-size: 30px; font-weight: bold; letter-spacing: 2px; font-family: 'Arial Black', Arial, sans-serif; }}
        .title {{ color: #2e3192; font-size: 24px; margin: 12px 0 4px 0; }}
        .subtitle {{ color: #666; font-size: 18px; margin-bottom: 28px; }}
        .info-table {{ width: 100%; font-size: 16px; margin-bottom: 24px; }}
        .info-table td {{ padding: 6px 0; }}
        .label {{ color: #2e3192; font-weight: bold; width: 90px; }}
        .footer {{ font-size: 14px; color: #999; margin-top: 32px; text-align: center; }}
        .highlight {{ color: #2e3192; font-weight: 600; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <span class="logo-text">TBAE</span>
            </div>
            <div class="title">Thank You for Reaching Out!</div>
            <div class="subtitle">We've received your contact request.</div>
        </div>
        <p>
            Dear <span class="highlight">{name}</span>,
        </p>
        <p>
            Thank you for contacting <span class="highlight">Team Building and Events (TBAE)</span>. <br>
            Your message has been received and a member of our team will get back to you as soon as possible.
        </p>
        <table class="info-table">
            <tr>
                <td class="label">Name:</td>
                <td>{name}</td>
            </tr>
            <tr>
                <td class="label">Email:</td>
                <td>{email}</td>
            </tr>
            <tr>
                <td class="label">Phone:</td>
                <td>{phone}</td>
            </tr>
            <tr>
                <td class="label">Message:</td>
                <td>{message}</td>
            </tr>
        </table>
        <p>
            If your enquiry is urgent, you can also reach us at <a href="mailto:info@tbae.co.za" style="color:#2e3192;text-decoration:underline;">info@tbae.co.za</a> or call us on <span class="highlight">+27 11 613 4297</span>.
        </p>
        <p>
            We look forward to assisting you!<br>
            <span class="highlight">The TBAE Team</span>
        </p>
        <div class="footer">
            &copy; {year} TBAE. All rights reserved.
        </div>
    </div>
</body>
</html>
"""

from rest_framework import generics
from .models import ContactRequest
from .serializers import ContactRequestSerializer
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.utils import timezone

# Paste email templates from above here (or import them if in a separate module)

class ContactRequestCreateView(generics.CreateAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        
        # ----------- STAFF EMAIL -----------
        staff_subject = "New Contact Request - TBAE"
        staff_recipients = [
            "mandy@tbae.co.za",
            "evan@tbae.co.za",
            settings.DEFAULT_FROM_EMAIL,
        ]
        staff_text_content = (
            f"Name: {instance.name}\n"
            f"Email: {instance.email}\n"
            f"Phone: {instance.phone}\n"
            f"Message: {instance.message}\n"
        )
        staff_html_content = STAFF_EMAIL_TEMPLATE.format(
            name=instance.name,
            email=instance.email,
            phone=instance.phone,
            message=instance.message,
        )
        staff_msg = EmailMultiAlternatives(
            subject=staff_subject,
            body=staff_text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=staff_recipients,
        )
        staff_msg.attach_alternative(staff_html_content, "text/html")
        staff_msg.send()

        # ----------- USER CONFIRMATION EMAIL -----------
        user_subject = "Thank You for Contacting TBAE"
        user_text_content = (
            f"Dear {instance.name},\n\n"
            "Thank you for contacting Team Building and Events (TBAE). "
            "Your message has been received and a member of our team will get back to you soon.\n\n"
            f"Your message:\n{instance.message}\n\n"
            "If urgent, please contact us at info@tbae.co.za or +27 833990000.\n\n"
            "The TBAE Team"
        )
        user_html_content = USER_CONFIRMATION_TEMPLATE.format(
            name=instance.name,
            email=instance.email,
            phone=instance.phone,
            message=instance.message,
            year=timezone.now().year
        )
        user_msg = EmailMultiAlternatives(
            subject=user_subject,
            body=user_text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[instance.email],
        )
        user_msg.attach_alternative(user_html_content, "text/html")
        user_msg.send()
