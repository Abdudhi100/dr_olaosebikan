# publications/urls.py
from django.urls import path
from .views import (AchievementListView,PublicationListView,PublicationDetailView)
app_name = 'publications'
    
urlpatterns = [
    path('achievements/', AchievementListView.as_view(), name='achievements'),
    path('', PublicationListView.as_view(), name='publication_list'),
    path('<slug:slug>/', PublicationDetailView.as_view(), name='publication_detail'),
]
