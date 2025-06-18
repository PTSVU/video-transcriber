from django.urls import path
from . import views

urlpatterns = [
    path('api/summarize/', views.summarize_view, name='summarize'),
]
