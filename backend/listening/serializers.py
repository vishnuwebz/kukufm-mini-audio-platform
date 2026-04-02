from rest_framework import serializers

from .models import ListeningProgress
from content.models import Episode


class ProgressUpdateSerializer(serializers.Serializer):
    episode_id = serializers.IntegerField()
    progress_seconds = serializers.IntegerField(min_value=0)

    def validate_episode_id(self, value):
        try:
            episode = Episode.objects.get(id=value, is_published=True, series__is_published=True)
        except Episode.DoesNotExist:
            raise serializers.ValidationError("Valid published episode not found.")
        return value

    def validate(self, attrs):
        episode = Episode.objects.get(id=attrs["episode_id"])
        progress_seconds = attrs["progress_seconds"]

        if progress_seconds > episode.duration_seconds:
            attrs["progress_seconds"] = episode.duration_seconds

        return attrs

class ContinueListeningSerializer(serializers.ModelSerializer):
    episode_id = serializers.IntegerField(source="episode.id", read_only=True)
    episode_title = serializers.CharField(source="episode.title", read_only=True)
    episode_number = serializers.IntegerField(source="episode.episode_number", read_only=True)
    duration_seconds = serializers.IntegerField(source="episode.duration_seconds", read_only=True)
    series_id = serializers.IntegerField(source="episode.series.id", read_only=True)
    series_title = serializers.CharField(source="episode.series.title", read_only=True)
    series_slug = serializers.CharField(source="episode.series.slug", read_only=True)
    cover_image_url = serializers.CharField(source="episode.series.cover_image_url", read_only=True)
    author_name = serializers.CharField(source="episode.series.author_name", read_only=True)

    class Meta:
        model = ListeningProgress
        fields = [
            "id",
            "episode_id",
            "episode_title",
            "episode_number",
            "duration_seconds",
            "series_id",
            "series_title",
            "series_slug",
            "cover_image_url",
            "author_name",
            "progress_seconds",
            "is_completed",
            "last_listened_at",
        ]