from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Language(TimeStampedModel):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.code})"


class Series(TimeStampedModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True)
    short_description = models.CharField(max_length=300)
    description = models.TextField(blank=True)
    author_name = models.CharField(max_length=255, blank=True)
    cover_image_url = models.URLField(blank=True)

    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="series_list"
    )
    language = models.ForeignKey(
        Language,
        on_delete=models.PROTECT,
        related_name="series_list"
    )

    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "Series"

    def __str__(self):
        return self.title


class Episode(TimeStampedModel):
    series = models.ForeignKey(
        Series,
        on_delete=models.CASCADE,
        related_name="episodes"
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    episode_number = models.PositiveIntegerField()
    audio_url = models.URLField()
    duration_seconds = models.PositiveIntegerField(help_text="Duration in seconds")
    is_published = models.BooleanField(default=False)

    class Meta:
        ordering = ["episode_number"]
        unique_together = ("series", "episode_number")

    def __str__(self):
        return f"{self.series.title} - Episode {self.episode_number}: {self.title}"