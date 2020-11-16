from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('admin/construct', views.db, name='construct'),
    path('get-games/', views.getGames, name='get-games')
]