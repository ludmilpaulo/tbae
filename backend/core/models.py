from django.db import models

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to="events/")
    date = models.DateField()

    def __str__(self):
        return self.title

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