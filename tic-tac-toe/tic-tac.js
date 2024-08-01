document.addEventListener("DOMContentLoaded", () => {
    const popup = document.querySelector('.popup');
    const closeBtn = document.querySelector('.close-btn');
    const playerForm = document.getElementById('playerForm');
    const currentTurnDiv = document.getElementById('currentTurn');
    
    let player1 = { name: '', option: 'x' }; 
    let player2 = { name: '', option: 'o' }; 

    let computerInTheGame = false;
    let computerTurn = false;

    let currentPlayer = player1;

    popup.classList.add('show');

    closeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    function changePopUpForWinner(player) {
        const element = document.querySelector('.popup-content h2');
        element.innerHTML = `Congrats <span class="red-text">${player.name}</span>! Do you want to play again? Enter players names:`; 
    }
    
    function returnPopUpText(){
        const element = document.querySelector('.popup-content h2');
        element.textContent = "Enter Player Names";
    }

    const cells = document.querySelectorAll('.game-board .cell');
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function checkForWin(player) {
        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (
                cells[a].querySelector('img')?.alt === player.option &&
                cells[b].querySelector('img')?.alt === player.option &&
                cells[c].querySelector('img')?.alt === player.option
            ) {
                currentTurnDiv.textContent = `${player.name} Won!`;
                return true;
            }
        }
        return false;
    }

    function resetGame() {
        cells.forEach(cell => {
            cell.classList.remove('selected'); 
            cell.innerHTML = ''; 
            cell.style.pointerEvents = 'auto';
        });

        currentPlayer = player1; 
        currentTurnDiv.textContent = `${player1.name}'s turn`; 
    }

    function getRandomEmptyCell() {
        const emptyCells = Array.from(cells).filter(cell => !cell.querySelector('img'));
        if (emptyCells.length === 0) return null; 
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }


    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        returnPopUpText();
        player1.name = capitalize(document.getElementById('player1').value);
        player2.name = capitalize(document.getElementById('player2').value);
        const computerOpponent = document.getElementById('computerOpponent').checked;

        if (!player2.name && computerOpponent) {
            player2.name = 'Computer';
            computerInTheGame = true;

        }

        resetGame();

        popup.classList.remove('show');
    });

    function capitalize(str) {
        if (typeof str === 'string') {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
        return str;
    }

   
  
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.classList.contains('selected')) return;
    
            cell.classList.add('selected');
            const imgElement = document.createElement('img');
            imgElement.src = currentPlayer.option === 'x' ? 'tic-tac-toe/img/x.png' : 'tic-tac-toe/img/o.png';
            imgElement.alt = currentPlayer.option; 
            cell.appendChild(imgElement);
    
            if (checkForWin(currentPlayer)) {
                cells.forEach(cell => cell.classList.add('selected'));
                changePopUpForWinner(currentPlayer);
                popup.classList.add('show');
                return; 
            }
    

            currentPlayer = currentPlayer === player1 ? player2 : player1;
            computerTurn = currentPlayer === player2; 
            currentTurnDiv.textContent = `${currentPlayer.name}'s turn`;

            if (computerInTheGame && computerTurn) {
                setTimeout(() => {
                    const randomCell = getRandomEmptyCell();
                    if (randomCell) {
                        const imgElement = document.createElement('img');
                        imgElement.src = currentPlayer.option === 'x' ? 'tic-tac-toe/img/x.png' : 'tic-tac-toe/img/o.png';
                        imgElement.alt = currentPlayer.option; 
                        randomCell.appendChild(imgElement);
                        randomCell.classList.add('selected');
    
       
                        if (checkForWin(currentPlayer)) {
                            cells.forEach(cell => cell.classList.add('selected'));
                            changePopUpForWinner(currentPlayer);
                            popup.classList.add('show');
                            return; 
                        }
    
               
                        currentPlayer = player1; 
                        currentTurnDiv.textContent = `${currentPlayer.name}'s turn`;
                    }
                }, 1000); 
            }
        });
    });
    

   

});



