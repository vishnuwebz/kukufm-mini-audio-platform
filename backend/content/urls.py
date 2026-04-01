from django.urls import path
from .views import (
    CategoryListView,
    LanguageListView,
    SeriesListView,
    SeriesDetailView,
    EpisodeDetailView,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("languages/", LanguageListView.as_view(), name="language-list"),
    path("series/", SeriesListView.as_view(), name="series-list"),
    path("series/<slug:slug>/", SeriesDetailView.as_view(), name="series-detail"),
    path("episodes/<int:pk>/", EpisodeDetailView.as_view(), name="episode-detail"),
]