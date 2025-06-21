from rest_framework import generics
from .models import Stat, TimelineEvent, TeamMember, About
from .serializers import StatSerializer, TimelineEventSerializer, TeamMemberSerializer, AboutSerializer

class StatListView(generics.ListAPIView):
    queryset = Stat.objects.all()
    serializer_class = StatSerializer

class TimelineEventListView(generics.ListAPIView):
    queryset = TimelineEvent.objects.all()
    serializer_class = TimelineEventSerializer

class TeamMemberListView(generics.ListAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer

class AboutDetailView(generics.RetrieveAPIView):
    queryset = About.objects.all()
    serializer_class = AboutSerializer

    def get_object(self):
        return About.objects.first()
