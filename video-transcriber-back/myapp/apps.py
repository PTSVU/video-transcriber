from django.apps import AppConfig
import os


class MyappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'myapp'
    path = os.path.dirname(os.path.abspath(__file__))
