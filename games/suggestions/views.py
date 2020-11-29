from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import requests, json, operator
import os
from .models import Game
from time import sleep
from bs4 import BeautifulSoup
from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options


def index(request):
    return render(request, 'suggestions/index.html')


# Function I made to construct the games database from steamspy API
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

    tag_values = {
        'rpg': 5,
        'fps': 5,
        'moba': 5,
        'battleroyale': 5,
        'sports': 5,
        'fighting': 5,
        'openworld': 2,
        'hackandslash': 1,
        'lootershooter': 3,
        'survival': 3,
        'shooter': 2,
        'storyrich': 3,
        'moddable': 1,
        'exploration': 3,
        'realistic': 3,
        'adventure': 1,
        'stealth': 4,
        'anime': 5,
        'sandbox': 3,
        'building': 2,
        'driving': 5,
        'loot': 3,
        'mmo': 5
    }

    for game in games:
        essential_score = 0
        score = 0
        for essential in essential_tags:
            if essential in game.tags:
                essential_score += 1

        if essential_score == len(essential_tags):
            for tag in request_tags:
                if tag in game.tags:
                    tag_value = tag_values[tag]
                    score += tag_value

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
            'price': price,
            'description': game_obj.description,
            'app_id': game_obj.app_id
        }

        games_list.append(game_dict)
    
    print(games_list)

    if len(limited_list) == 0:
        return JsonResponse({'has_items': False})
    else:
        return JsonResponse({'has_items': True, 'games': games_list})


# Function I used to get games description from the steampowered API
def descriptions(request):
    games = Game.objects.all()
    bad = 0
    counter = 0
    for game in games:
        counter += 1
        if counter >= 270:
            app_id = game.app_id
            response = requests.get(f'https://store.steampowered.com/api/appdetails?appids={app_id}')
            try:
                json = response.json()
                if json[f'{app_id}']['success'] == True:
                    raw = json[f'{app_id}']['data']['detailed_description']
                    clean = BeautifulSoup(raw, 'lxml').text
                    game.description = clean
                    game.save()
                    print(f'{game.name} Description added!')
                    sleep(1.5)
                else:
                    bad += 1
                    print(f'NO API AVAILABLE AT {app_id}')
                    print(bad)
            except:
                print(f'Error to json at app {app_id}')
            
    return HttpResponse(status=200)

def descriptions2(request):
    games = Game.objects.all()
    options = Options()
    options.add_experimental_option('prefs', {'intl.accept_languages': 'en,en_US'})
    nav = Chrome(chrome_options=options)
    for game in games:
        nav.get(f'https://store.steampowered.com/app/{game.app_id}')
        try:
            desc = nav.find_element_by_class_name('game_description_snippet').text
            game.description = desc
            game.save()
            print(f'{game.name} updated')
        except:
            print('Exception 1')
            try:
                select = nav.find_element_by_id('ageYear')
                for option in select.find_elements_by_tag_name('option'):
                    if option.text == '1990':
                        option.click()
                        break
                access = nav.find_element_by_xpath('//*[@id="app_agegate"]/div[1]/div[3]/a[1]')
                access.click()
                sleep(1)
                desc = nav.find_element_by_class_name('game_description_snippet').text
                game.description = desc
                game.save()
                print(f'{game.name} updated')
            except Exception as e:
                print(e)
    return HttpResponse(status=200)
        