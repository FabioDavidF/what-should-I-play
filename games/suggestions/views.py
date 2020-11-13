from django.shortcuts import render
from django.http import HttpResponse
import requests, json
import os
from .models import Game
from time import sleep

# Create your views here.

def index(request):
    return HttpResponse('<h1>Hi<h1>')

def db(request):
    f = open('suggestions/tops.txt', 'r')
    string = f.read()

    dic = json.loads(string)
    lista = []
    for app in dic:
        lista.append(app)
    
    for app in lista:
        print(f'sending request to {app}')
        result = requests.get(f'https://steamspy.com/api.php?request=appdetails&appid={app}')
        json_obj = result.json()
        name = json_obj['name']
        app_id = json_obj['appid']
        price = json_obj['price']
        image = f'https://steamcdn-a.akamaihd.net/steam/apps/{app_id}/header.jpg'

        tags_obj = json_obj['tags']
        tag_list = []
        for tag in tags_obj:
            tag_list.append(tag)
        
        #Converting tags list to a string so it can be saved as a CharField
        separator = ', '
        tags = separator.join(tag_list)

        game = Game(
            name=name,
            app_id=app_id,
            price=price,
            image=image,
            tags=tags
        )
        #game.save()
        #print(f'{name} Added to database!')
        sleep(1.1) #Fucking gay ass pussy ass low computing power ass shitty ass API server
  
    return HttpResponse('Success')