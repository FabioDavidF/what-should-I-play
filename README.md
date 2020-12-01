# What should I play v1
![Welcome](https://i.postimg.cc/QjVwf8XR/Screenshot-1.jpg)

## Description
 What Should I Play is a simple, mobile-responsive, website with the intent of suggesting, by tags, games for those of us who suffer from the ironic lack of games to play amidst the gigantic steam library.
 The design is aimed to be minimalistic and highly focused on User Experience, with most of the work being done on the CSS and UX elements of JavaScript.
 Therefore, the objective of such work is to create an aplication that gets its job done satisfyingly and effectively

## Technologies used
The back-end API was written using django, and the front-end is pure JavaScript / CSS / HTML.

## How does it work?
The heart of the project is the sorting algorithm written in the back-end, which queries the database in a (hopefully) smart way for games matching the tags given, taking in consideration how important a tag is (For example: "adventure" isn't nearly as important as "FPS"), and its position in how many times it was voted in the steam store (For example: if a game has a tag, but it is the 28th most voted tag for the game, it won't be nearly as important as the game's number 1 tag).

## Database
It took some thinking to figure out how to construct my own database with information needed from games, the way I did it was using the [steamspy](https://steamspy.com/) API for most info, and since the Steampowered API sucks (and has no good documentation), I made a simple crawler to get each game's short description from the steam store.

## Things I learned with this project
The most exciting learning experience I've had with the project was actually constructing the database, when getting the general data from the [steamspy](https://steamspy.com/) API I learned how to extract and use data from an external API. And when adding decently readable descriptions, I made my first crawler with [selenium](https://selenium-python.readthedocs.io/) which scoured the steamstore and is even able to bypass those random age checks that steam loves to throw before you can actually get to see the game's info. It was absolutely magical seeing selenium opening and extracting games information from the store automatically

### This is how I constructed the database
```python
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
        game.save()
        print(f'{name} Added to database!')
        sleep(1.1) 
  
    return HttpResponse('Success')
```

### And for extracting the descriptions from the steam store, I used selenium
```python
def descriptions2(request):
    games = Game.objects.all()
    options = Options()
    # Making sure the page and therefore description is in english
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
```
