from __future__ import annotations

import re
from typing import Tuple
from urllib.parse import quote

from django.conf import settings
from django.urls import reverse, NoReverseMatch
from django.utils.html import strip_tags as dj_strip_tags

import bleach
from bleach.css_sanitizer import CSSSanitizer
from premailer import transform


# ---------------------------------------------------------------------------
# URL helpers
# ---------------------------------------------------------------------------

def _abs(url_path: str) -> str:
    """
    Convert a path into an absolute URL using NEWSLETTER_PUBLIC_BASE_URL.
    """
    base = getattr(settings, "NEWSLETTER_PUBLIC_BASE_URL", "").rstrip("/")
    return f"{base}{url_path}"


def _rev(name: str, *args) -> str:
    """
    Reverse tolerant to optional namespacing.
    Tries bare name, then 'newsletter:name'.
    """
    try:
        return reverse(name, args=args)
    except NoReverseMatch:
        return reverse(f"newsletter:{name}", args=args)


# ---------------------------------------------------------------------------
# Sanitization / rendering
# ---------------------------------------------------------------------------

def _make_css_sanitizer() -> CSSSanitizer:
    """
    Create a CSSSanitizer that works across Bleach versions.
    Some versions don't accept allow_hsl_function/allow_rgb_function.
    """
    # Try the newest signature first
    try:
        return CSSSanitizer(
            allowed_css_properties=None,  # use safe defaults
            allowed_svg_properties=None,
            allow_hsl_function=True,
            allow_rgb_function=True,
        )
    except TypeError:
        # Fallback: widely supported kwargs
        try:
            return CSSSanitizer(
                allowed_css_properties=None,
                allowed_svg_properties=None,
            )
        except TypeError:
            # Last resort: defaults only
            return CSSSanitizer()


def inline_css(html: str) -> str:
    """
    Inline CSS for better email client compatibility.
    """
    return transform(html, base_url=getattr(settings, "NEWSLETTER_PUBLIC_BASE_URL", ""))


def sanitize_html(html: str) -> str:
    """
    Bleach 6+: ALLOWED_TAGS is a frozenset; union with our extras.
    Allow <style> and style="" via CSSSanitizer (requires tinycss2).
    """
    # Tags
    base_tags = set(bleach.sanitizer.ALLOWED_TAGS)
    extra_tags = {
        "p", "div", "span", "img", "table", "thead", "tbody", "tfoot",
        "tr", "td", "th", "h1", "h2", "h3", "h4", "h5", "h6", "br", "hr", "style",
    }
    allowed_tags = sorted(base_tags | extra_tags)

    # Attributes (merge with Bleach defaults)
    base_attrs = dict(bleach.sanitizer.ALLOWED_ATTRIBUTES)

    def merge_attrs(tag: str, extras: set[str]) -> list[str]:
        return sorted(set(base_attrs.get(tag, [])) | extras)

    attributes = {
        **base_attrs,
        "*": merge_attrs("*", {"class", "style", "id"}),
        "a": merge_attrs("a", {"href", "title", "target", "rel"}),
        "img": merge_attrs("img", {"src", "alt", "width", "height"}),
        "table": merge_attrs("table", {"border", "cellpadding", "cellspacing", "width"}),
        "td": merge_attrs("td", {"width", "colspan", "rowspan", "align", "valign", "style"}),
        "th": merge_attrs("th", {"width", "colspan", "rowspan", "align", "valign", "style"}),
    }

    css = _make_css_sanitizer()

    cleaner = bleach.Cleaner(
        tags=allowed_tags,
        attributes=attributes,
        protocols=["http", "https", "mailto", "data"],
        strip=False,
        css_sanitizer=css,
    )
    return cleaner.clean(html)


# ---------------------------------------------------------------------------
# Tracking rewrites
# ---------------------------------------------------------------------------

_A_TAG_RE = re.compile(
    r'<a\s+[^>]*href=["\'](?P<href>[^"\']+)["\'][^>]*>(?P<label>.*?)</a>',
    re.I | re.S,
)


def rewrite_links_for_tracking(html: str, token: str) -> str:
    """
    Wrap all <a href> links to go through our click tracker.
    """
    click_url_base = _abs(_rev("nl-click", token))

    def repl(m: re.Match) -> str:
        href = m.group("href")
        tracked = f"{click_url_base}?u={quote(href, safe='')}"
        return m.group(0).replace(href, tracked)

    return _A_TAG_RE.sub(repl, html)


def add_open_pixel(html: str, token: str) -> str:
    """
    Add a 1x1 pixel that hits our open tracker.
    """
    pixel = (
        f'<img src="{_abs(_rev("nl-open", token))}" width="1" height="1" '
        f'style="display:none;" alt="" />'
    )
    return html + pixel


def render_email(html: str, token: str) -> Tuple[str, str]:
    """
    sanitize → rewrite links → add pixel → inline CSS → (html, text)
    """
    safe = sanitize_html(html)
    tracked = rewrite_links_for_tracking(safe, token)
    with_pixel = add_open_pixel(tracked, token)
    final_html = inline_css(with_pixel)
    return final_html, dj_strip_tags(final_html)


# ---------------------------------------------------------------------------
# Unsubscribe link injection
# ---------------------------------------------------------------------------

def build_unsubscribe_url(token: str) -> str:
    return _abs(_rev("nl-unsubscribe", token))


def inject_unsubscribe(html: str, unsubscribe_token: str) -> str:
    """
    Replace the {{unsubscribe_url}} placeholder with the per-subscriber URL.
    """
    return html.replace("{{unsubscribe_url}}", build_unsubscribe_url(unsubscribe_token))
