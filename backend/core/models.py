from django.db import models





class FAQCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class FAQ(models.Model):
    category = models.ForeignKey(
        FAQCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='faqs'
    )
    question = models.CharField(max_length=512)
    answer = models.TextField()
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['category__order', 'order', 'question']

    def __str__(self):
        return self.question



class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    text = models.TextField()
    company = models.CharField(max_length=100)
    image = models.ImageField(upload_to="testimonials/", blank=True, null=True)
    feedback = models.TextField()
    avatar = models.ImageField(upload_to='testimonials/')

    def __str__(self):
        return f"{self.name} ({self.company})"


class GalleryImage(models.Model):
    url = models.ImageField(upload_to="gallery/")
    title = models.CharField(max_length=100)
    alt = models.CharField(max_length=200, blank=True)

class Stat(models.Model):
    label = models.CharField(max_length=100)
    value = models.PositiveIntegerField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'label']

    def __str__(self):
        return f"{self.label} ({self.value})"

class TimelineEvent(models.Model):
    year = models.PositiveIntegerField()
    title = models.CharField(max_length=150)
    desc = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'year']

    def __str__(self):
        return f"{self.year}: {self.title}"

class TeamMember(models.Model):
    name = models.CharField(max_length=80)
    role = models.CharField(max_length=100)
    photo = models.ImageField(upload_to="team/")
    bio = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

class About(models.Model):
    content = models.TextField()
    facebook_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    tiktok_url = models.URLField(blank=True, null=True)
    whatsapp_url = models.URLField(blank=True, null=True)
    pinterest_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return "About Page Content"
class ContactRequest(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    responded = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.email}"

class Homepage(models.Model):
    bannerTitle = models.CharField(max_length=100)
    bannerImage = models.ImageField(upload_to='homepage/')



class Client(models.Model):
    name = models.CharField(max_length=120, unique=True)
    logo = models.ImageField(upload_to='clients/')
    website = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name