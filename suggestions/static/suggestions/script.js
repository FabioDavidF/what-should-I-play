document.addEventListener('DOMContentLoaded', () => {
    const started_button = document.querySelector('.started-button-button');
    const multiplayer_button = document.querySelector('.multiplayer-button-button');
    const competitive_button = document.querySelector('.competitive-button-button');
    const coop_button = document.querySelector('.coop-button-button');
    const singleplayer_button = document.querySelector('.singleplayer-button-button');
    const about_button = document.querySelector('.about-button')
    const contact_button = document.querySelector('.contact-button');
    const home_button = document.querySelector('.home-icon');

    const navbar = document.querySelector('.navbar');
    const about_view = document.querySelector('.about-view');
    const contact_view = document.querySelector('.contact-view');
    const welcome_view = document.querySelector('.first');
    const player_choice = document.querySelector('.second');
    const multi_choice = document.querySelector('.third-multi');
    const tags_canvas = document.querySelector('.tags-canvas')
    const tags_grid = document.querySelector('.tags-grid')
    const games_canvas = document.querySelector('.fourth')
    const games_canvas_inner = document.querySelector('.games')

    function clearPage(exception=0) {
        welcome_view.style.display = 'none';
        player_choice.style.display = 'none';
        multi_choice.style.display = 'none';
        tags_canvas.style.display = 'none';
        games_canvas.style.display = 'none';
        about_view.style.display = 'none';
        contact_view.style.display = 'none';

        if (exception !== 0) {
            exception.style.display = 'block';
        } 
    }

    clearPage(welcome_view);
    
    about_button.onclick = () => {
        clearPage(about_view)
        document.title = 'About - What Should I Play';
    }

    home_button.onclick = () => {
        clearPage(welcome_view);
        document.title = 'What Should I Play';
    }

    contact_button.onclick = () => {
        clearPage(contact_view);
        document.title = 'Contact - What Should I Play'
    }

    // Started button onclick to scroll to player choice
    started_button.onclick = () => {        
        clearPage(welcome_view);
        player_choice.style.display = 'block';
        player_choice.scrollIntoView(true);

    }

    // Multiplayer button onlick to scroll to multi choice
    multiplayer_button.onclick = () => {
        // Clearing out rest of the site just in case
        clearPage(player_choice);

        multi_choice.style.display = 'block';
        multi_choice.scrollIntoView(true);
    }

    // Competitive button onclick to scroll to respective tags
    competitive_button.onclick = () => {
        // Clearing out rest of the site just in case
        clearPage(multi_choice);

        tags_canvas.style.display = 'block';
        tags_canvas.scrollIntoView(true);
        loadTags('competitive')
        loadSubmitter('competitive')
    }

    // Coop button onclick to scroll to tags
    coop_button.onclick = () => {
        // Clearing out rest of the site just in case
        clearPage(multi_choice);

        tags_canvas.style.display = 'block';
        tags_canvas.scrollIntoView(true);
        loadTags('coop');
        loadSubmitter('coop')
    }

    // Singleplayer button onlick to scroll to tags
    singleplayer_button.onclick = () => {
        // Clearing out rest of the site just in case
        clearPage(player_choice);

        tags_canvas.style.display = 'block';
        tags_canvas.scrollIntoView(true);
        loadTags('singleplayer');
        loadSubmitter('singleplayer')
    }

    function loadTags(kind) {
        // Clearing tags, just in case
        tags_grid.innerHTML = ''

        if (kind === 'competitive') {
            var tags = ['FPS', 'MOBA', 'Battle Royale','Card Game', 'Sports','Platformer', 'Fighting', 'Survival', 'Team-Based', 'War', 'Strategy','Arena Shooter', 'Medieval', 'Deck Building', 'RTS', 'Gore']
        } else if (kind === 'coop') {
            var tags = ['FPS', 'RPG', 'Open World', 'Sandbox', 'Building', 'Survival', 'Looter Shooter', 'Driving', 'Story Rich', 'Loot', 'Strategy', 'Crafting', 'Action', 'Fighting', 'Zombies', 'Horror', 'Puzzle']
        } else if (kind === 'singleplayer') {
            var tags = ['RPG', 'FPS', 'Open World', 'Hack And Slash', 'Looter Shooter', 'Survival', 'Shooter', 'Story Rich', 'Moddable', 'Exploration', 'Realistic', 'Adventure', 'Stealth', 'Anime', 'Futuristic', '2D', 'Indie', 'Driving', 'Racing', 'Turn-Based', 'Choices Matter']
        }

        for (tag of tags) {
            var card = document.createElement('div');
            card.className = 'tag-card';
            card.innerHTML = `${tag}`;
            tags_grid.appendChild(card) 
        }

        // Giving onclick for each tag
        var all_tags = document.querySelectorAll('.tag-card');
        for (var i = 0; i < all_tags.length; i++) {
            var tag = all_tags[i];
            tag.onclick = function() {
                if (this.classList.contains('selected')) {
                    this.classList.remove('selected')
                } else {
                    this.classList.add('selected');
                }
            };
        }
    }

    function loadSubmitter(kind) {
        parent = document.querySelector('.submitter-parent')
        // Clearing previous button just in case
        parent.innerHTML = ''
        child = document.createElement('div')
        child.className = 'submitter'
        child.innerHTML = 'Get Games'
        child.onclick = () => {
            const selected_elements = document.querySelectorAll('.selected')

            if (selected_elements.length !== 0) {
                const selected_tags = []
                for (element of selected_elements) {
                    const value = element.innerHTML.replace(/ /g, '').toLowerCase()
                    selected_tags.push(value)
                }
                var tags_string = ''
                for (tag of selected_tags) {
                    var tags_string = tags_string.concat(`${tag},`)
                }
                var tags_string = tags_string.slice(0, -1)
                if (kind === 'singleplayer') {
                    fetch(`get-games/?essentials=singleplayer&tags=${tags_string}`)
                    .then(response => response.json())
                    .then(games => {
                        const games_array = games.games
                        games_canvas_inner.innerHTML = ''
                        var c = 0
                        const len = games.games.length
                        games_array.forEach(element => {
                            c++
                            loadGame(element, c, len);
                        });
                        
                        games_canvas.style.display = 'block';
                        const first_game = document.getElementById('1');
                        first_game.scrollIntoView(true);
                    })
                }
                else if (kind === 'competitive') {
                    fetch(`get-games/?essentials=competitive&tags=${tags_string}`)
                    .then(response => response.json())
                    .then(games => {
                        const games_array = games.games
                        games_canvas_inner.innerHTML = ''
                        var c = 0
                        const len = games.games.length
                        games_array.forEach(element => {
                            c++
                            loadGame(element, c, len)
                        });
                        games_canvas.style.display = 'block';
                        const first_game = document.getElementById('1')
                        first_game.scrollIntoView(true);
                    })
                } else if (kind === 'coop') {
                    fetch(`get-games/?essentials=co-op&tags=${tags_string}`)
                    .then(response => response.json())
                    .then(games => {
                        if (games.has_items == false) {console.log('no games')}
                        const games_array = games.games
                        games_canvas_inner.innerHTML = ''
                        var c = 0
                        const len = games.games.length
                        games_array.forEach(element => {
                            c++
                            loadGame(element, c, len)
                        });
                        games_canvas.style.display = 'block';
                        const first_game = document.getElementById('1')
                        first_game.scrollIntoView(true);
                    })
                }
            } 
        }
        parent.appendChild(child)
    }

    function loadGame(game, number, length) {
        const canvas = document.querySelector('.games')
        const element = document.createElement('div')
        const content_parent = document.createElement('div')
        content_parent.className = 'content-parent'
        element.className = `game`
        element.id = number
        const element_name = document.createElement('p')
        element_name.innerHTML = game.name
        element_name.className = 'game-name'
        content_parent.appendChild(element_name)
        const element_image = document.createElement('div')
        element_image.className = 'image-parent'
        const image_child = document.createElement('img')
        image_child.className = 'image-child'
        const redirect_anchor = document.createElement('a')
        redirect_anchor.href = `https://store.steampowered.com/app/${game.app_id}`
        image_child.src = game.image
        redirect_anchor.appendChild(image_child)
        element_image.appendChild(redirect_anchor)
        content_parent.appendChild(element_image)
        const element_description = document.createElement('p')
        element_description.innerHTML = game.description
        element_description.className = 'game-description'
        content_parent.appendChild(element_description)
        const element_price = document.createElement('p')
        if (game.price === 0) {
            element_price.innerHTML = 'Free to Play'
        } else {
            element_price.innerHTML = `Steam Price: $${game.price}`
        }
        element_price.className = 'game-price'
        content_parent.appendChild(element_price)
    
        if (number !== length) {
            const arrow_parent = document.createElement('div')
            arrow_parent.className = 'arrow-parent'
            const arrow_child = document.createElement('img')
            arrow_child.src = "../../static/suggestions/arrow.png"
            arrow_child.className = 'arrow-child'
            arrow_child.onclick = () => {
                const next_number = number + 1
                const next_game = document.getElementById(`${next_number}`)
                next_game.scrollIntoView(true);
            }
            arrow_parent.appendChild(arrow_child)
            element.appendChild(content_parent)
            element.appendChild(arrow_parent)
            
        } else {
            const back = document.createElement('div')
            back.innerHTML = 'Back to start'
            back.className = 'back'
            back.onclick = () => {
                welcome_view.style.display = 'block';
                navbar.scrollIntoView(true);
                setTimeout(() => {clearPage(welcome_view);}, 1000)
            }
            content_parent.appendChild(back)
            element.appendChild(content_parent)
        }
        
        canvas.appendChild(element)
    }
})