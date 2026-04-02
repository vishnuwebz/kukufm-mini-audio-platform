from rest_framework import serializers
from .models import Category, Language, Series, Episode


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ["id", "name", "code"]


class EpisodeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Episode
        fields = [
            "id",
            "title",
            "episode_number",
            "duration_seconds",
            "is_published",
        ]


class EpisodeDetailSerializer(serializers.ModelSerializer):
    series_id = serializers.IntegerField(source="series.id", read_only=True)
    series_title = serializers.CharField(source="series.title", read_only=True)
    series_slug = serializers.CharField(source="series.slug", read_only=True)

    class Meta:
        model = Episode
        fields = [
            "id",
            "series_id",
            "series_title",
            "series_slug",
            "title",
            "description",
            "episode_number",
            "audio_url",
            "duration_seconds",
            "is_published",
            "created_at",
            "updated_at",
        ]

class SeriesListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    language = LanguageSerializer(read_only=True)
    total_episodes = serializers.SerializerMethodField()

    class Meta:
        model = Series
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "author_name",
            "cover_image_url",
            "category",
            "language",
            "is_published",
            "total_episodes",
        ]

    def get_total_episodes(self, obj):
        return obj.episodes.filter(is_published=True).count()


class SeriesDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    language = LanguageSerializer(read_only=True)
    episodes = serializers.SerializerMethodField()

    class Meta:
        model = Series
        fields = [
            "id",
            "title",
            "slug",
            "short_description",
            "description",
            "author_name",
            "cover_image_url",
            "category",
            "language",
            "is_published",
            "episodes",
            "created_at",
            "updated_at",
        ]

    def get_episodes(self, obj):
        published_episodes = obj.episodes.filter(is_published=True).order_by("episode_number")
        return EpisodeListSerializer(published_episodes, many=True).data