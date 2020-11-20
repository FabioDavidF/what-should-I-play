document.addEventListener('DOMContentLoaded', () => {
    const started_button = document.querySelector('.started-button');
    const multiplayer_button = document.querySelector('.multiplayer-button');
    const competitive_button = document.querySelector('.competitive-button');
    const coop_button = document.querySelector('.coop-button');
    const singleplayer_button = document.querySelector('.singleplayer-button');

    const player_choice = document.querySelector('.second');
    const multi_choice = document.querySelector('.third-multi');
    const tags_canvas = document.querySelector('.tags-canvas')
    const tags_grid = document.querySelector('.tags-grid')

    player_choice.style.display = 'none';
    multi_choice.style.display = 'none';
    tags_canvas.style.display = 'none';

    // Started button onclick to scroll to player choice
    started_button.onclick = () => {
        player_choice.style.display = 'block';
        player_choice.scrollIntoView(true);
    }

    // Multiplayer button onlick to scroll to multi choice
    multiplayer_button.onclick = () => {
        multi_choice.style.display = 'block';
        multi_choice.scrollIntoView(true);
    }

    // Competitive button onclick to scroll to respective tags
    competitive_button.onclick = () => {
        tags_canvas.style.display = 'block';
        tags_canvas.scrollIntoView(true);
        loadTags('competitive')
    }

    // Coop button onclick to scroll to tags
    coop_button.onclick = () => {
        tags_canvas.style.display = 'block';
        tags_canvas.scrollIntoView(true);
        loadTags('coop');
    }

    // Singleplayer button onlick to scroll to tags
    singleplayer_button.onclick = () => {
        tags_canvas.style.display = 'block';
        tags_canvas.scrollIntoView(true);
        loadTags('singleplayer');
        loadSubmitter('tags')
    }

    function loadTags(kind) {
        if (kind === 'competitive') {
            var tags = ['FPS', 'MOBA', 'Battle Royale', 'Sports', 'Fighting', 'Survival']
        } else if (kind === 'coop') {
            var tags = ['FPS', 'RPG', 'Open World', 'Sandbox', 'Building', 'Survival', 'Looter Shooter', 'Driving', 'Story Rich', 'Loot']
        } else if (kind === 'singleplayer') {
            var tags = ['RPG', 'FPS', 'Open World', 'Hack And Slash', 'Looter Shooter', 'Survival', 'Shooter', 'Story Rich', 'Moddable', 'Exploration', 'Realistic', 'Adventure', 'Stealth', 'Anime']
        }

        for (tag of tags) {
            var card = document.createElement('div');
            card.className = 'tag-card';
            card.innerHTML = `${tag}`;
            tags_grid.appendChild(card) 
        }

        // Giving onclick for each tag, no idea why the () => syntax wasn't working
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
        const parent = document.createElement('div')
        parent.className = 'submitter-parent'
        child = document.createElement('div')
        child.className = 'submitter'
        child.innerHTML = 'Get Games'
        child.onclick = () => {
            const selected_elements = document.querySelectorAll('.selected')
            const selected_tags = []
            for (element of selected_elements) {
                const value = element.innerHTML
                selected_tags.push(value)
            }
            var tags_string = ''
            for (tag of selected_tags) {
                var tags_string = tags_string.concat(`${tag},`)
            }
            console.log(tags_string)
        }
        parent.appendChild(child)
        tags_canvas.appendChild(parent)

        
    }
})
