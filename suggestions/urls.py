from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('get-games/', views.getGames, name='get-games'),
    path('admin/db', views.saving, name='db')
]