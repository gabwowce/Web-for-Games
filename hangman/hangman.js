document.addEventListener("DOMContentLoaded", () => {
    const gameLives=[ 
        'hangman/img/hangman_7.png',
        'hangman/img/hangman_6.png',
        'hangman/img/hangman_5.png',
        'hangman/img/hangman_4.png',
        'hangman/img/hangman_3.png',
        'hangman/img/hangman_2.png',
        'hangman/img/hangman_1.png',
        'hangman/img/hangman_0.png'        
    ]
    const words = [
        'squirrel', 
        'archaeology', 
        'apple', 
        'psychology', 
        'bizarre', 
        'quasar', 
        'xylophone', 
        'juxtaposition', 
        'zephyr', 
        'kaleidoscope', 
        'ethereal', 
        'quintessential', 
        'vortex', 
        'labyrinth', 
        'metamorphosis', 
        'serendipity', 
        'cacophony', 
        'euphoria', 
        'paradox', 
        'resilience', 
        'mellifluous', 
        'whimsical', 
        'anemone', 
        'hypotenuse', 
        'unprecedented', 
        'conundrum', 
        'nostalgia', 
        'nebulous', 
        'ubiquitous', 
        'synchronicity'
    ];
    

    let playerLives;
    const gameTitle = document.getElementById('game-title');
    const hangmanImage = document.getElementById('hangman-image');
    const rows = document.querySelectorAll('.alphabet-row');
    const guessWordRow = document.querySelector('.guess-word');
    const playAgainButton = document.getElementById('play-again'); 

    playAgainButton.addEventListener('click', StartGame);

    StartGame();

    function StartGame() {
        function randomNumber() {
            let i = words.length - 1;
            const j = Math.floor(Math.random() * (i + 1));
            return j;
        }
        var randomNumber = randomNumber();


        playerLives = 7; 
        hangmanImage.src = gameLives[playerLives]; 
        gameTitle.innerHTML = "Hangman Game";

        guessWordRow.innerHTML = '';
        rows.forEach(row => {
            row.innerHTML = ''; 
            const keys = row.getAttribute('data-keys');
            keys.split('').forEach(char => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card');

                const cardChar = document.createElement('h2');
                cardChar.classList.add('char');
                cardChar.innerHTML = char;

                cardElement.append(cardChar);
                row.append(cardElement);

                cardElement.addEventListener('click', usedCharCheck);
            });
        });

        words[randomNumber].split('').forEach(wordChar => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('word-char-card');

            const cardChar = document.createElement('h2');
            cardChar.classList.add('wordChar');
            cardChar.innerHTML = wordChar.toUpperCase();

            cardElement.append(cardChar);
            guessWordRow.append(cardElement);
        });

        playAgainButton.style.visibility = 'hidden'; 
    }

    function usedCharCheck() {
        const char = this.querySelector('.char').innerHTML;
        this.classList.add('used');

        if (!guessedChar(char)) {
            playerLives--;
            hangmanImage.src = gameLives[playerLives];
            if (playerLives === 0) {
                gameOver();
            }
        }
    }

    function guessedChar(char) {
        const wordChars = document.querySelectorAll('.word-char-card .wordChar');
        let found = false;
        wordChars.forEach(wordChar => {
            if (wordChar.innerHTML === char) {
                wordChar.classList.add('guessed');
                found = true; 
            }
        });
        if (found) {
            checkWin(); 
        }
        return found;
    }

    function gameOver() {
        gameTitle.innerHTML = "GAME OVER";
        const wordChars = document.querySelectorAll('.word-char-card .wordChar');
        wordChars.forEach(wordChar => {
            wordChar.classList.add('guessed');
        });
        playAgainButton.style.visibility = 'visible'; 

        const cards = document.querySelectorAll('card');
        cards.forEach(card=>{
            card.classList.add('disabled');
        })

    }

    function checkWin() {
        const wordChars = document.querySelectorAll('.word-char-card .wordChar');
        let allGuessed = true;
    
        wordChars.forEach(wordChar => {
            if (!wordChar.classList.contains('guessed')) {
                allGuessed = false; 
            }
        });
    
        if (allGuessed) {
             gameTitle.innerHTML = "Congratulations! You've won!";
            playAgainButton.style.visibility = 'visible'; 
        }
    }

})

