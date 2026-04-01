from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Category, Language, Series, Episode
from .serializers import (
    CategorySerializer,
    LanguageSerializer,
    SeriesListSerializer,
    SeriesDetailSerializer,
    EpisodeDetailSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class LanguageListView(generics.ListAPIView):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [AllowAny]


class SeriesListView(generics.ListAPIView):
    serializer_class = SeriesListSerializer
    permission_classes = [AllowAny]
    filterset_fields = ["category__slug", "language__code"]
    search_fields = ["title", "short_description", "description", "author_name"]
    ordering_fields = ["created_at", "title"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Series.objects.filter(is_published=True)
            .select_related("category", "language")
            .prefetch_related("episodes")
        )


class SeriesDetailView(generics.RetrieveAPIView):
    serializer_class = SeriesDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = "slug"

    def get_queryset(self):
        return (
            Series.objects.filter(is_published=True)
            .select_related("category", "language")
            .prefetch_related("episodes")
        )


class EpisodeDetailView(generics.RetrieveAPIView):
    serializer_class = EpisodeDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return (
            Episode.objects.filter(is_published=True, series__is_published=True)
            .select_related("series")
        )