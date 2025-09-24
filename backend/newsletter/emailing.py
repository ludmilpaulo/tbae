from __future__ import annotations
from typing import Dict
from django.core.mail import EmailMultiAlternatives

def render_html(html: str, ctx: Dict[str, str]) -> str:
    out = html or ""
    for k, v in ctx.items():
        out = out.replace("{{" + k + "}}", v or "")
    return out

def make_email(*, subject: str, html: str, to_email: str, from_email: str, context: Dict[str, str]) -> EmailMultiAlternatives:
    rendered_html = render_html(html, context)
    text = f"{subject}\n\n(HTML content)"
    msg = EmailMultiAlternatives(subject=subject, body=text, from_email=from_email, to=[to_email])
    msg.attach_alternative(rendered_html, "text/html")
    return msg
