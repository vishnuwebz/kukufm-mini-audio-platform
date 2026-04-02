from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from content.models import Episode
from .models import ListeningProgress
from .serializers import ProgressUpdateSerializer, ContinueListeningSerializer


class UpdateListeningProgressView(generics.GenericAPIView):
    serializer_class = ProgressUpdateSerializer
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        episode_id = serializer.validated_data["episode_id"]
        progress_seconds = serializer.validated_data["progress_seconds"]

        episode = get_object_or_404(
            Episode,
            id=episode_id,
            is_published=True,
            series__is_published=True,
        )

        progress_seconds = min(progress_seconds, episode.duration_seconds)
        is_completed = progress_seconds >= episode.duration_seconds

        progress_obj, created = ListeningProgress.objects.update_or_create(
            user=request.user,
            episode=episode,
            defaults={
                "progress_seconds": progress_seconds,
                "is_completed": is_completed,
            },
        )

        return Response(
            {
                "message": "Listening progress saved successfully.",
                "created": created,
                "progress": ContinueListeningSerializer(progress_obj).data,
            },
            status=status.HTTP_200_OK,
        )


class ContinueListeningListView(generics.ListAPIView):
    serializer_class = ContinueListeningSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            ListeningProgress.objects.filter(
                user=self.request.user,
                is_completed=False,
                episode__is_published=True,
                episode__series__is_published=True,
            )
            .select_related("episode", "episode__series")
            .order_by("-last_listened_at")
        )