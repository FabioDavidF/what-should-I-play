from django.contrib import admin
from django.urls import path, include
from . import views
from django.views.generic.base import RedirectView
from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage

urlpatterns = [
    path('', views.index, name='index'),
    path('get-games/', views.getGames, name='get-games'),
    path(
        "favicon.ico",
        RedirectView.as_view(url='/static/favicon.ico', permanent=True),
    ),
]