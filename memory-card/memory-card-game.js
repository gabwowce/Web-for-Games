const cardsArray = [
    { name: 'Apple', img: 'memory-card/img/apple.png' },
    { name: 'Papaya', img: 'memory-card/img/papaya.png' },
    { name: 'Soursop', img: 'memory-card/img/soursop.png' },
    { name: 'Coconut', img: 'memory-card/img/coconut.png' },
    { name: 'Kumquat', img: 'memory-card/img/kumquat.png' },
    { name: 'Bactris-gasipaes', img: 'memory-card/img/bactris-gasipaes.png' },
    { name: 'Banana', img: 'memory-card/img/banana.png' },
    { name: 'Apple', img: 'memory-card/img/apple.png' },
    { name: 'Papaya', img: 'memory-card/img/papaya.png' },
    { name: 'Soursop', img: 'memory-card/img/soursop.png' },
    { name: 'Coconut', img: 'memory-card/img/coconut.png' },
    { name: 'Kumquat', img: 'memory-card/img/kumquat.png' },
    { name: 'Bactris-gasipaes', img: 'memory-card/img/bactris-gasipaes.png' },
    { name: 'Banana', img: 'memory-card/img/banana.png' },
    { name: 'Dragon-fruit', img: 'memory-card/img/dragon-fruit.png' },
    { name: 'Dragon-fruit', img: 'memory-card/img/dragon-fruit.png' }
];

const gameBoard = document.querySelector('.game-board');
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function createBoard(){
    shuffle(cardsArray);
    cardsArray.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardIFront = document.createElement('div');
        cardIFront.classList.add('card-front');

        const cardIBack = document.createElement('div');
        cardIBack.classList.add('card-back');

        const imgElement = document.createElement('img');
        imgElement.src = card.img;
        imgElement.alt = card.name;

        cardIBack.append(imgElement);
        cardInner.append(cardIBack);
        cardInner.append(cardIFront);

        cardElement.append(cardInner);

        gameBoard.appendChild(cardElement);

        cardElement.addEventListener('click', flipCard);
    });

}

function flipCard(){
    if (lockBoard) return;
    if (this === firstCard) return;
    this.classList.add('flipped');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }
    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

createBoard();