document.addEventListener("DOMContentLoaded", () => {
    const popup = document.querySelector('.popup');
    const closeBtn = document.querySelector('.close-btn');
    const playerForm = document.getElementById('playerForm');
    const currentTurnDiv = document.getElementById('currentTurn');
    
    let player1 = { name: '', option: 'tic-tac-toe/img/x.png' };
    let player2 = { name: '', option: 'tic-tac-toe/img/o.png' };
    let currentPlayer = player1;

    popup.classList.add('show');

    closeBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });


    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        player1.name = document.getElementById('player1').value;
        player2.name = document.getElementById('player2').value;
        const computerOpponent = document.getElementById('computerOpponent').checked;

        if (!player2.name && computerOpponent) {
            player2.name = 'Computer';
        }

        currentPlayer = player1;
        currentTurnDiv.textContent = `${player1.name}'s turn`;

        popup.classList.remove('show');
    });


    const cells = document.querySelectorAll('.game-board .cell');
    

    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.classList.contains('selected')) return;

            cell.classList.add('selected');
            const imgElement = document.createElement('img');
            imgElement.src = currentPlayer.option;
            cell.appendChild(imgElement);

            if (currentPlayer === player1) {
                currentPlayer = player2;
                currentTurnDiv.textContent = `${player2.name}'s turn`;
            } else {
                currentPlayer = player1;
                currentTurnDiv.textContent = `${player1.name}'s turn`;
            }
        });
    });
});
