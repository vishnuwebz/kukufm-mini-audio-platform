from django.contrib import admin
from .models import ListeningProgress


@admin.register(ListeningProgress)
class ListeningProgressAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "episode",
        "progress_seconds",
        "is_completed",
        "last_listened_at",
    )
    list_filter = ("is_completed", "last_listened_at")
    search_fields = ("user__email", "episode__title", "episode__series__title")