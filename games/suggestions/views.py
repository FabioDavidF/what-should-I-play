from django.shortcuts import render
from django.http import HttpResponse
import requests

# Create your views here.

def index(request):
    return HttpResponse('<h1>Hi<h1>')

def db(request):
    response = requests.get('https://steamspy.com/api.php?request=all&page=0')
    json = response.json()
    #continuar quando a api voltarbuceta gcu infernooooooooooooooooooooooooooooo
    pass