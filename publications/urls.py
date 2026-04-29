# publications/urls.py
from django.urls import path
from .views import (
    AchievementListView,
    PublicationCreateView,
    PublicationDetailView,
    PublicationListView,
)
app_name = 'publications'
    
urlpatterns = [
    path('achievements/', AchievementListView.as_view(), name='achievements'),
    path('new/', PublicationCreateView.as_view(), name='publication_create'),
    path('', PublicationListView.as_view(), name='publication_list'),
    path('<slug:slug>/', PublicationDetailView.as_view(), name='publication_detail'),
]
