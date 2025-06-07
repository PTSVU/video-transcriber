from django.urls import path
from . import views

urlpatterns = [
    path('api/transcribe/', views.transcribe_view, name='transcribe'),
]
