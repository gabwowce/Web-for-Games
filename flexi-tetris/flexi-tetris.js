document.addEventListener('DOMContentLoaded', () => {
    const tetrominoes = [
        
        {
            shape: [
                [1, 1, 1, 1]
            ],
            color: '#711415'
        },
      
        {
            shape: [
                [1, 1],
                [1, 1]
            ],
            color: '#ae311e'
        },
    
        {
            shape: [
                [0, 1, 0],
                [1, 1, 1]
            ],
            color: '#f37324'
        },

        {
            shape: [
                [1, 1]
            ],
            color: '#f6a020'
        },

        {
            shape: [
                [1],
                [1]
            ],
            color: '#f8cc1b'
        },

        {
            shape: [
                [1, 0, 0],
                [1, 1, 1]
            ],
            color: '#b5be2f'
        },

        {
            shape: [
                [0, 0, 1],
                [1, 1, 1]
            ],
            color: '#72b043'
        },
        {
            shape: [
                [1]
            ],
            color: '#007f4e'
        }
    ];
    let placedPiecesCount = 0;

    const gameGrid = document.getElementById('gameGrid');
    const pieceContainer = document.getElementById('pieceContainer');

    const gridWidth = 10;
    const gridHeight = 10;

    // Inicializuojam žaidimo grid'ą
    for (let i = 0; i < gridWidth * gridHeight; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.index = i; // priskiriame kiekvienai ląstelei unikalų indeksą
        gameGrid.appendChild(cell);
    }

    // Generuoja 3 atsitiktines daleles
    function generateRandomPieces() {
        const pieceContainer = document.getElementById('pieceContainer');
    
        // Išvalykite ankstesnes dalis
        pieceContainer.innerHTML = '';
    
        // Sukurkite ir pridėkite naujus div elementus su klasėmis
        for (let i = 1; i <= 3; i++) {
            const piece = document.createElement('div');
            piece.classList.add(`piece-${i}`);
            pieceContainer.appendChild(piece);
        }
    
        // Pasirinkite atsitiktines daleles ir priskirkite joms
        const chosenPieces = [];
        
        // Užtikriname, kad pasirinktos detalės būtų unikalios
        while (chosenPieces.length < 3) {
            const randomIndex = Math.floor(Math.random() * tetrominoes.length);
            if (!chosenPieces.includes(randomIndex)) {
                chosenPieces.push(randomIndex);
            }
        }
    
        // Priskirti detales prie kiekvieno div
        chosenPieces.forEach((index, idx) => {
            const piece = pieceContainer.children[idx]; // Gauti sukurtą elementą
            piece.dataset.index = index; // Pridėti index prie dataset
            piece.innerHTML = ''; // Išvalome ankstesnį turinį
            
            tetrominoes[index].shape.forEach(row => {
                const rowDiv = document.createElement('div');
                rowDiv.style.display = 'flex';
                row.forEach(cell => {
                    const cellDiv = document.createElement('div');
                    cellDiv.style.width = '45px';
                    cellDiv.style.height = '45px';
                    cellDiv.style.margin = '2px';
                    cellDiv.style.borderRadius = '5px';
                    cellDiv.style.backgroundColor = cell ? tetrominoes[index].color : 'transparent';
                    rowDiv.appendChild(cellDiv);

                     // Sukuriame overlay
                    const overlay = document.createElement('div');
                    overlay.classList.add('overlay'); // Priskirti overlay klasę
                    overlay.style.backgroundColor = 'transparent'; // Pradinis skaidrumas
                    overlay.style.position = 'absolute'; // Overlay pozicija
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.transition = 'background-color 0.5s ease'; // Pridėti animaciją
                    cellDiv.appendChild(overlay); // Pridėti overlay prie ląstelės

                    rowDiv.appendChild(cellDiv);
                });
                piece.appendChild(rowDiv);
            });
    
            dragElement(piece); // Priskirti vilkimo funkciją
        });
    }
    

    function dragElement(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.dataset.initialTop = element.offsetTop; // Pradinė vertikali pozicija
        element.dataset.initialLeft = element.offsetLeft; // Pradinė horizontali pozicija
    
        // Užfiksuokite pradinį pelės paspaudimo momentą
        element.onmousedown = function(e) {
            e.preventDefault();
            pos3 = e.clientX; // Nustato pradinę x poziciją
            pos4 = e.clientY; // Nustato pradinę y poziciją
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;           
        };
    
        function elementDrag(e) {
            e.preventDefault();
            // Apskaičiuokite kiek elementas turėtų judėti
            pos1 = e.clientX - pos3; // Naudokite pradinę X poziciją
            pos2 = e.clientY - pos4; // Naudokite pradinę Y poziciją
    
            // Atnaujinkite elementų pozicijas
            element.style.top = (parseFloat(element.dataset.initialTop) + pos2) + "px"; // Atnaujinkite vertikalią poziciją
            element.style.left = (parseFloat(element.dataset.initialLeft) + pos1) + "px"; // Atnaujinkite horizontalią poziciją
        }
    
        function closeDragElement(e) {
            document.onmouseup = null;
            document.onmousemove = null;
            
          
            checkDrop(element); 
        }
        
    }
    
    
    
    function checkDrop(piece) {
        const gridCells = Array.from(gameGrid.children);
        const pieceBounds = piece.getBoundingClientRect();
        const gridBounds = gameGrid.getBoundingClientRect();
    
        const gridCellWidth = 50; // Ląstelės plotis
        const gridCellHeight = 50; // Ląstelės aukštis
        const tolerance = 20; // Tolerancija (pikseliais)
    
        // Apskaičiuojame pradinės ląstelės indeksus
        const startColIndex = Math.floor((pieceBounds.left - gridBounds.left + tolerance) / gridCellWidth);
        const startRowIndex = Math.floor((pieceBounds.top - gridBounds.top + tolerance) / gridCellHeight);
        
        // Nustatome tetromino dimensijas
        const pieceRows = piece.children.length;
        const pieceCols = piece.children[0].children.length;
    
        let canPlace = true;
    
        // Tikriname, ar tetromino gali būti dedama į tinklą
        for (let rowOffset = 0; rowOffset < pieceRows; rowOffset++) {
            for (let colOffset = 0; colOffset < pieceCols; colOffset++) {
                if (tetrominoes[parseInt(piece.dataset.index)].shape[rowOffset][colOffset]) {
                    const targetRowIndex = startRowIndex + rowOffset;
                    const targetColIndex = startColIndex + colOffset;
                    const targetIndex = targetRowIndex * gridWidth + targetColIndex;
    
                    // Patikrinkite ribas
                    if (targetRowIndex < 0 || targetRowIndex >= gridHeight || targetColIndex < 0 || targetColIndex >= gridWidth || (gridCells[targetIndex] && gridCells[targetIndex].style.backgroundColor)) {
                        canPlace = false;
                        break;
                    }
                }
            }
            if (!canPlace) break; // Išeiti iš ciklo, jei negalima padėti detalės
        }
    
        // Jei viskas gerai, užpildykite tinklo ląsteles
        if (canPlace) {
            // Apskaičiuojame galutinę padėtį
            const finalRowIndex = startRowIndex;
            const finalColIndex = startColIndex;
    
            const pieceIndex = parseInt(piece.dataset.index);
            const tetromino = tetrominoes[pieceIndex];
    
            for (let rowOffset = 0; rowOffset < tetromino.shape.length; rowOffset++) {
                for (let colOffset = 0; colOffset < tetromino.shape[rowOffset].length; colOffset++) {
                    if (tetromino.shape[rowOffset][colOffset]) {
                        const targetIndex = (finalRowIndex + rowOffset) * gridWidth + (finalColIndex + colOffset);
                        if (gridCells[targetIndex]) {
                            gridCells[targetIndex].style.backgroundColor = tetromino.color; // Užpildykite spalva
                        }
                    }
                }
            }
            placedPiecesCount++;
           
            pieceContainer.removeChild(piece); // Pašalinkite detalę iš konteinerio

            // Patikrinkite, ar buvo padėtos 3 detalės
            if (placedPiecesCount === 3) {
                generateRandomPieces(); // Generuoti naujas dalis
                placedPiecesCount = 0; // Atstatyti skaičių
            }

            removeFullRowsAndColumns(); 
        } else {
            // Grąžinti detalę į pradinę poziciją
            piece.style.top = piece.dataset.initialTop + "px"; // Grąžinkite pradinę vertikalią poziciją
            piece.style.left = piece.dataset.initialLeft + "px"; // Grąžinkite pradinę horizontalią poziciją
        }
    }

    function removeFullRowsAndColumns() {
        const gridCells = Array.from(gameGrid.children);
        
        // Pašalinti pilnas eiles
        for (let row = 0; row < gridHeight; row++) {
            let isFullRow = true;
            
            for (let col = 0; col < gridWidth; col++) {
                const index = row * gridWidth + col;
                if (!gridCells[index].style.backgroundColor) {
                    isFullRow = false;
                    break;
                }
            }
            
            if (isFullRow) {
                // Pridėti fade-out klasę
                for (let col = 0; col < gridWidth; col++) {
                    const index = row * gridWidth + col;
                    gridCells[index].classList.add('fade-out');
                }
                
                // Išvalyti po animacijos pabaigos
                setTimeout(() => {
                    for (let col = 0; col < gridWidth; col++) {
                        const index = row * gridWidth + col;
                        gridCells[index].style.backgroundColor = ''; // Išvalome spalvą
                        gridCells[index].classList.remove('fade-out'); // Pašaliname fade-out klasę
                    }
                }, 300); // Laikas (ms) iki ląstelių išvalymo
            }
        }
        
        // Pašalinti pilnus stulpelius
        for (let col = 0; col < gridWidth; col++) {
            let isFullColumn = true;
            
            for (let row = 0; row < gridHeight; row++) {
                const index = row * gridWidth + col;
                if (!gridCells[index].style.backgroundColor) {
                    isFullColumn = false;
                    break;
                }
            }
            
            if (isFullColumn) {
                // Pridėti fade-out klasę
                for (let row = 0; row < gridHeight; row++) {
                    const index = row * gridWidth + col;
                    gridCells[index].classList.add('fade-out');
                }
                
                // Išvalyti po animacijos pabaigos
                setTimeout(() => {
                    for (let row = 0; row < gridHeight; row++) {
                        const index = row * gridWidth + col;
                        gridCells[index].style.backgroundColor = ''; // Išvalome spalvą
                        gridCells[index].classList.remove('fade-out'); // Pašaliname fade-out klasę
                    }
                }, 300); // Laikas (ms) iki ląstelių išvalymo
            }
        }
    }
    
    
    

    
    
    
    

    generateRandomPieces();

  

});
