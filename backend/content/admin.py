from django.contrib import admin
from .models import Category, Language, Series, Episode


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug", "created_at")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "code", "created_at")
    search_fields = ("name", "code")


class EpisodeInline(admin.TabularInline):
    model = Episode
    extra = 1


@admin.register(Series)
class SeriesAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "language", "is_published", "created_at")
    list_filter = ("is_published", "category", "language")
    search_fields = ("title", "slug", "author_name")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [EpisodeInline]


@admin.register(Episode)
class EpisodeAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "series", "episode_number", "duration_seconds", "is_published")
    list_filter = ("is_published", "series")
    search_fields = ("title", "series__title")