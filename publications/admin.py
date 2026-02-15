# publications/admin.py
from django.contrib import admin
from .models import Achievement, Publication

@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'year')
    list_filter = ('year',)
    search_fields = ('title', 'organization')

@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'journal', 'year', 'is_featured', 'is_published')
    list_filter = ('year', 'journal', 'is_featured', 'is_published')
    search_fields = ('title', 'journal', 'authors')
    prepopulated_fields = {'slug': ('title',)}
    list_select_related = ('doctor',)
    list_per_page = 20
