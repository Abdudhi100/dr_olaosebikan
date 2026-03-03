# core_app/urls.py
from django.urls import path
from .views import ContactView, HomeView, StaticPageDetailView, RobotsTxtView, HealthzView

app_name = "core_app"

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
    path("pages/<slug:slug>/", StaticPageDetailView.as_view(), name="static_page"),
    path("robots.txt", RobotsTxtView.as_view(), name="robots"),
    path("contact/", ContactView.as_view(), name="contact"),
    path("healthz/", HealthzView.as_view(), name="healthz"),
]
