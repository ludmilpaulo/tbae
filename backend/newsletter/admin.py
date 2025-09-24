from django.contrib import admin
from .models import List, Subscriber, Template, Campaign, Delivery

admin.site.register(List)
admin.site.register(Subscriber)
admin.site.register(Template)
admin.site.register(Campaign)
admin.site.register(Delivery)
