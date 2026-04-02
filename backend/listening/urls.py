from django.urls import path
from .views import UpdateListeningProgressView, ContinueListeningListView

urlpatterns = [
    path("progress/", UpdateListeningProgressView.as_view(), name="update-listening-progress"),
    path("continue-listening/", ContinueListeningListView.as_view(), name="continue-listening"),
]