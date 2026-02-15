# publications/views.py
from multiprocessing import context
from django.shortcuts import render
from django.views.generic import ListView, DetailView
from .models import Achievement, Publication
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from core_app.mixins import SEOMixin
from django.db.models import Q
class AchievementListView(ListView):
    model = Achievement
    template_name = 'publications/achievements.html'
    context_object_name = 'achievements'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["total_publications"] = Publication.objects.filter(
            is_published=True
        ).count()
        context["featured_publications"] = Publication.objects.filter(
            is_featured=True, is_published=True
        )
        return context



# publications/views.py
from django.views.generic import DetailView, ListView
from core_app.mixins import SEOMixin
from .models import Publication


class PublicationListView(SEOMixin, ListView):
    model = Publication
    template_name = "publications/publication_list.html"
    context_object_name = "publications"
    paginate_by = 10

    seo_title = "Research & Publications — Dr Olaosebikan"
    seo_description = "Peer-reviewed publications, research papers, and medical insights by Dr Olaosebikan."

    def get_queryset(self):
        return (
            Publication.objects.filter(is_published=True)
            .only("title", "slug", "journal", "year", "authors", "is_featured", "created_at")
            .order_by("-year", "-created_at")
        )
    
   

    def get_queryset(self):
        qs = Publication.objects.filter(is_published=True).only(
            "title", "slug", "journal", "year", "authors", "is_featured", "created_at"
        ).order_by("-year", "-created_at")

        q = (self.request.GET.get("q") or "").strip()
        if q:
            qs = qs.filter(
                Q(title__icontains=q)
                | Q(journal__icontains=q)
                | Q(authors__icontains=q)
                | Q(year__icontains=q)
            )
        return qs



class PublicationDetailView(SEOMixin, DetailView):
    model = Publication
    template_name = "publications/publication_detail.html"
    context_object_name = "publication"

    def get_queryset(self):
        return (
            Publication.objects.filter(is_published=True)
            .only("title", "slug", "journal", "year", "authors", "abstract", "doi_link", "pdf")
        )

    def get_seo_title(self):
        return f"{self.object.title} — Publication | Dr Olaosebikan"

    def get_seo_description(self):
        if self.object.abstract:
            return self.object.abstract.strip()[:160]
        return f"{self.object.title} published in {self.object.journal} ({self.object.year})."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # ✅ Use the correct field name from your model: "authors"
        context["authors_display"] = (self.object.authors or "").strip()

        # Simple "Back" context (optional)
        context["back_url"] = "publications:publication_list"
        return context
