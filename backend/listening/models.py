from django.conf import settings
from django.db import models

from content.models import Episode


class ListeningProgress(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="listening_progress"
    )
    episode = models.ForeignKey(
        Episode,
        on_delete=models.CASCADE,
        related_name="listening_progress"
    )
    progress_seconds = models.PositiveIntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    last_listened_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "episode")
        ordering = ["-last_listened_at"]

    def __str__(self):
        return f"{self.user.email} - {self.episode.title} ({self.progress_seconds}s)"