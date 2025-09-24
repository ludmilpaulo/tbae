import django_filters as df
from .models import Campaign, Subscriber

class CampaignFilter(df.FilterSet):
    class Meta:
        model = Campaign
        fields = {"status":["exact"], "list":["exact"], "template":["exact"], "from_email":["exact"], "created_by":["exact"]}

class SubscriberFilter(df.FilterSet):
    email = df.CharFilter(lookup_expr="icontains")
    class Meta:
        model = Subscriber
        fields = {"list":["exact"], "is_confirmed":["exact"], "email":["icontains"]}
