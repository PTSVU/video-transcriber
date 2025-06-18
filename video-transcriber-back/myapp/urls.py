from django.urls import path
from . import views

urlpatterns = [
path('api/translate/', views.translate_view, name='translate'),
]
