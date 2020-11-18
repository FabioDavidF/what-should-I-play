from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests, json, operator
import os
from .models import Game
from time import sleep

# Create your views here.

def index(request):
    return render(request, 'suggestions/index.html')

def db(request):
    """
    Function used to construct database via the steamspy and the steamcdn API's
    """
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


def getGames(request):
    """
    Returns a json response with a list of games that best match
    the tags given in the 'tags' parameter on the query string
    """
    request_tags = request.GET.get('tags').split(',')
    essential_tags = request.GET.get('essentials').split(',')
    print(essential_tags)
    print(request_tags)
    tag_amount = len(request_tags)
    games = Game.objects.all()
    dic = {}

    
    for game in games:
        essential_score = 0
        score = 0
        for essential in essential_tags:
            if essential in game.tags:
                essential_score += 1

        if essential_score == len(essential_tags):
            for tag in request_tags:
                if tag in game.tags:
                    score += 1

        if score > 0:
            dic[f'{game.id}'] = score
    
    sorted_dic = sorted(dic.items(), key=operator.itemgetter(1), reverse=True)

    sorted_list = []
    for game in sorted_dic:
        sorted_list.append(game) 
    
    limited_list = sorted_list[0:10]
    print(limited_list)

    games_list = []
    for game in limited_list:
        game_obj = Game.objects.get(pk=game[0])
        price = game_obj.price / 100 #Is saved in cents in DB, converting to dollars
        game_dict = {
            'name': game_obj.name,
            'image': game_obj.image,
            'tags': game_obj.tags,
            'price': price
        }

        games_list.append(game_dict)
    
    print(games_list)

    if len(limited_list) == 0:
        return JsonResponse({'has_items': False})
    else:
        return JsonResponse({'has_items': True, 'games': games_list})
       
