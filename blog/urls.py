from django.urls import path
from .views import PostListView, PostDetailView, PostCreateView

app_name = "blog"

urlpatterns = [
    path("", PostListView.as_view(), name="post_list"),
    path("add/", PostCreateView.as_view(), name="post_add"),
    path("<slug:slug>/", PostDetailView.as_view(), name="post_detail"),
]
