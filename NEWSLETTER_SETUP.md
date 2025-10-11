# Newsletter System - Setup & Usage Guide

## ✅ Unsubscribe URL Fixed!

The newsletter unsubscribe functionality is now properly configured and working.

---

## 🔧 What Was Fixed

### Issue:
- Unsubscribe URLs had duplicate `/nl/` prefix
- Missing `NEWSLETTER_PUBLIC_BASE_URL` configuration
- URLs were not resolving correctly

### Solution:
1. ✅ Fixed URL patterns in `backend/newsletter/urls.py`
2. ✅ Added `NEWSLETTER_PUBLIC_BASE_URL` configuration
3. ✅ URLs now generate correctly

---

## 📋 Newsletter URLs

### Public Endpoints (No Authentication Required):

**Unsubscribe:**
- Development: `http://localhost:8000/n/unsubscribe/{token}/`
- Production: `https://africarise.pythonanywhere.com/n/unsubscribe/{token}/`

**Open Tracking (1x1 pixel):**
- Development: `http://localhost:8000/n/open/{token}/`
- Production: `https://africarise.pythonanywhere.com/n/open/{token}/`

**Click Tracking:**
- Development: `http://localhost:8000/n/click/{token}/?u={encoded_url}`
- Production: `https://africarise.pythonanywhere.com/n/click/{token}/?u={encoded_url}`

---

## 🎯 How It Works

### 1. Email Template with Unsubscribe Link

When creating an email template, include the `{{unsubscribe_url}}` placeholder:

```html
<div style="text-align: center; margin-top: 40px; padding: 20px; background: #f5f5f5;">
  <p style="color: #666; font-size: 12px;">
    If you no longer wish to receive these emails, you can
    <a href="{{unsubscribe_url}}" style="color: #0066cc;">unsubscribe here</a>.
  </p>
</div>
```

### 2. System Replaces Placeholder

When sending a campaign, the system:
1. Replaces `{{unsubscribe_url}}` with subscriber's unique unsubscribe link
2. Each subscriber gets their own token
3. Token is stored in `Subscriber.unsubscribe_token`

### 3. Unsubscribe Process

When a subscriber clicks the unsubscribe link:
1. System finds subscriber by token
2. Sets `unsubscribed_at` to current timestamp
3. Sets `is_confirmed` to `False`
4. Shows confirmation message
5. Subscriber won't receive future campaigns

---

## 📧 Complete Email Template Example

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #333; font-size: 28px;">TBAE Team Building</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 20px 40px;">
              <h2 style="color: #333; font-size: 24px; margin: 0 0 20px;">Monthly Newsletter</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
                Welcome to our monthly team building newsletter! Here are some exciting updates...
              </p>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 15px;">
                Check out our new activities and special offers this month!
              </p>
            </td>
          </tr>
          
          <!-- Call to Action -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="https://tbae.co.za/activities" style="display: inline-block; padding: 15px 40px; background-color: #0066cc; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      View Activities
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer with Unsubscribe -->
          <tr>
            <td style="padding: 40px; background-color: #f9f9f9; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px; color: #999; font-size: 12px; text-align: center;">
                © 2025 TBAE Team Building. All rights reserved.
              </p>
              <p style="margin: 0; color: #999; font-size: 12px; text-align: center;">
                <a href="{{unsubscribe_url}}" style="color: #0066cc; text-decoration: none;">Unsubscribe</a> | 
                <a href="https://tbae.co.za/privacy" style="color: #0066cc; text-decoration: none;">Privacy Policy</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 🧪 Testing Unsubscribe

### Step 1: Create Test Campaign

1. Go to Admin Panel: http://localhost:3000/admin
2. Create a List (e.g., "Test List")
3. Add a Subscriber with your email
4. Create a Template with `{{unsubscribe_url}}`
5. Create a Campaign

### Step 2: Send Test Email

Option A - Via Newsletter Composer:
1. Go to: http://localhost:3000/newsletter
2. Select your list
3. Compose email with unsubscribe link
4. Send to yourself

Option B - Via Admin Panel:
1. Go to Admin → Campaigns
2. Use SendCampaignCard component
3. Send campaign

### Step 3: Test Unsubscribe

1. Open the email in your inbox
2. Click the unsubscribe link
3. You should see: "You have been unsubscribed."
4. Check Admin → Subscribers
5. Verify `unsubscribed_at` is set

### Step 4: Verify No Future Emails

1. Send another campaign to the same list
2. Unsubscribed user should NOT receive it
3. Only confirmed, not-unsubscribed users get emails

---

## 🔍 Troubleshooting

### Issue: Unsubscribe link not working

**Check:**
1. Template includes `{{unsubscribe_url}}`
2. Backend running on correct port
3. `NEWSLETTER_PUBLIC_BASE_URL` is set

**Debug:**
```bash
cd backend
python manage.py shell
```

```python
from newsletter.models import Subscriber
from newsletter.utils import build_unsubscribe_url

# Get a subscriber
sub = Subscriber.objects.first()
print(f"Token: {sub.unsubscribe_token}")
print(f"URL: {build_unsubscribe_url(sub.unsubscribe_token)}")
```

### Issue: URL shows localhost in production

**Fix:** Set environment variable:
```bash
export NEWSLETTER_PUBLIC_BASE_URL="https://africarise.pythonanywhere.com"
```

Or in `.env`:
```
NEWSLETTER_PUBLIC_BASE_URL=https://africarise.pythonanywhere.com
```

### Issue: Token not found

**Possible causes:**
1. Subscriber was deleted
2. Database was reset
3. Using wrong token

**Solution:**
- Tokens are unique per subscriber
- Regenerate by creating new campaign

---

## 📊 Tracking Features

### Open Tracking

Every email includes a 1x1 transparent pixel:
```html
<img src="http://localhost:8000/n/open/{delivery_token}/" 
     width="1" height="1" style="display:none;" alt="" />
```

When loaded, records `opened_at` in `Delivery` table.

### Click Tracking

All `<a href>` links are rewritten to:
```
http://localhost:8000/n/click/{delivery_token}/?u={original_url}
```

Tracks clicks and redirects to original URL.

### Unsubscribe Tracking

Uses `Subscriber.unsubscribe_token` (different from delivery token):
```
http://localhost:8000/n/unsubscribe/{subscriber_token}/
```

Records `unsubscribed_at` timestamp.

---

## ⚙️ Configuration

### Backend Settings

In `backend/backend/settings.py`:

```python
# Newsletter Configuration
NEWSLETTER_PUBLIC_BASE_URL = os.getenv(
    "NEWSLETTER_PUBLIC_BASE_URL",
    "https://africarise.pythonanywhere.com" if not DEBUG else "http://localhost:8000"
)
```

### Environment Variables

**Development (.env):**
```bash
NEWSLETTER_PUBLIC_BASE_URL=http://localhost:8000
DEBUG=True
```

**Production (.env):**
```bash
NEWSLETTER_PUBLIC_BASE_URL=https://africarise.pythonanywhere.com
DEBUG=False
```

---

## 📝 Database Models

### Subscriber
```python
class Subscriber(models.Model):
    email = models.EmailField()
    unsubscribe_token = models.CharField(max_length=64, unique=True)
    is_confirmed = models.BooleanField(default=False)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
```

### Delivery
```python
class Delivery(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    subscriber = models.ForeignKey(Subscriber, on_delete=models.CASCADE)
    token = models.CharField(max_length=64, unique=True)
    sent_at = models.DateTimeField(null=True)
    opened_at = models.DateTimeField(null=True)
    clicked_at = models.DateTimeField(null=True)
```

---

## 🎯 Best Practices

### 1. Always Include Unsubscribe Link
- Required by anti-spam laws (CAN-SPAM, GDPR)
- Use `{{unsubscribe_url}}` placeholder
- Make it visible and easy to find

### 2. Respect Unsubscribes
- System automatically excludes unsubscribed users
- Don't manually re-subscribe without consent
- Check `unsubscribed_at` before sending

### 3. Test Before Sending
- Send test to yourself first
- Click all links to verify
- Check unsubscribe works

### 4. Track Metrics
- Monitor open rates
- Track click-through rates
- Review unsubscribe patterns

---

## 🚀 Production Deployment

### 1. Set Environment Variables

```bash
NEWSLETTER_PUBLIC_BASE_URL=https://africarise.pythonanywhere.com
DEFAULT_FROM_EMAIL=news@tbae.co.za
EMAIL_HOST=uk71.siteground.eu
EMAIL_PORT=465
EMAIL_HOST_USER=news@tbae.co.za
EMAIL_HOST_PASSWORD=your_password
EMAIL_USE_SSL=True
```

### 2. Test Unsubscribe URL

```bash
curl https://africarise.pythonanywhere.com/n/unsubscribe/test-token/
```

Should return: "Invalid unsubscribe token." (or success if token exists)

### 3. Monitor Logs

Check for unsubscribe activity:
```python
Subscriber.objects.filter(unsubscribed_at__isnull=False).count()
```

---

## ✅ Checklist

Before sending campaigns:

- [ ] `{{unsubscribe_url}}` in template footer
- [ ] Template tested and renders correctly
- [ ] Subscribers confirmed and active
- [ ] `NEWSLETTER_PUBLIC_BASE_URL` configured
- [ ] Email settings working
- [ ] Test email sent and received
- [ ] Unsubscribe link clicked and works
- [ ] Tracking pixels loading
- [ ] Click tracking redirects working

---

## 📞 Support

If unsubscribe links don't work:

1. Check backend logs for errors
2. Verify URL configuration
3. Test with curl/Postman
4. Check subscriber token exists
5. Review newsletter/utils.py

**The unsubscribe functionality is now fully operational!** ✅

---

## 🎉 Summary

Your newsletter system now has:
- ✅ Working unsubscribe URLs
- ✅ Unique tokens per subscriber
- ✅ Automatic exclusion of unsubscribed users
- ✅ Open tracking
- ✅ Click tracking
- ✅ Professional email templates
- ✅ GDPR/CAN-SPAM compliance

**Ready to send newsletters!** 📧🚀

