from django.views.generic import ListView, DetailView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.contrib import messages
from core_app.mixins import SEOMixin
from .models import Post
from .forms import PostForm

class PostListView(SEOMixin, ListView):
    model = Post
    template_name = "blog/post_list.html"
    context_object_name = "posts"
    paginate_by = 12

    seo_title = "Blog & Health Tips — Dr Olaosebikan"
    seo_description = "Read expert articles, health tips, and rheumatology updates from Dr Olaosebikan."
    seo_type = "blog"

    def get_queryset(self):
        return Post.objects.filter(is_published=True).select_related("author").only(
            "title",
            "slug",
            "excerpt",
            "featured_image",
            "created_at",
            "author__first_name",
            "author__last_name",
        )

class PostDetailView(SEOMixin, DetailView):
    model = Post
    template_name = "blog/post_detail.html"
    context_object_name = "post"

    def get_queryset(self):
        return Post.objects.filter(is_published=True)

    def get_seo_title(self):
        return f"{self.object.title} | Blog"

    def get_seo_description(self):
        if self.object.excerpt:
            return self.object.excerpt.strip()[:160]
        return f"Read {self.object.title} on Dr Olaosebikan's blog."

    def get_seo_image(self):
        if self.object.featured_image:
            return self.object.featured_image.url
        return None

    def get_seo_schema_type(self):
        return "BlogPosting"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Fetch a few recent posts to display at the bottom of the article
        context["recent_posts"] = Post.objects.filter(is_published=True).exclude(pk=self.object.pk).order_by("-created_at")[:3]
        return context

class PostCreateView(LoginRequiredMixin, SEOMixin, CreateView):
    model = Post
    form_class = PostForm
    template_name = "blog/post_form.html"
    success_url = reverse_lazy("blog:post_list")
    
    seo_title = "Add New Article | Blog"
    seo_description = "Create a new blog post."
    seo_type = "website"

    def form_valid(self, form):
        form.instance.author = self.request.user
        messages.success(self.request, "Article added successfully.")
        return super().form_valid(form)
