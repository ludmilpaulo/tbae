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

class About(models.Model):
    content = models.TextField()

class Homepage(models.Model):
    bannerTitle = models.CharField(max_length=100)
    bannerImage = models.ImageField(upload_to='homepage/')