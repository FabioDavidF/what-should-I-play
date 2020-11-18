document.addEventListener('DOMContentLoaded', () => {
    const started = document.querySelector('.started-button')
    const player_choice = document.querySelector('.second')

    player_choice.style.display = 'none'

    //When get started button is clicked, scrolls into first choice
    started.onclick = () => {
        player_choice.style.display = 'block'
        player_choice.scrollIntoView(true)
    }
})