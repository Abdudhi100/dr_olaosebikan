# profiles/urls.py
from django.urls import path
from .views import DoctorProfileDetailView
from . import views

app_name = 'profiles'

urlpatterns = [
    path('<slug:slug>/', DoctorProfileDetailView.as_view(), name='doctor-profile'),

]
