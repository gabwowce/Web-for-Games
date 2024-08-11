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

    const gameBoard = document.querySelector('.game-board');
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

    // for (let i = 0; i < gridWidth * gridHeight; i++) {
    //     const cell = document.createElement('div');
    //     gameBoard.appendChild(cell);
    // }

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

                });
                piece.appendChild(rowDiv);
            });
    
            dragElement(piece); // Priskirti vilkimo funkciją
        });

        piecesPosition();
    }
    

    function dragElement(element) {
        let offsetX, offsetY;
    
        // Užfiksuokite pradinį pelės paspaudimo momentą
        element.onmousedown = function(e) {
            e.preventDefault();
            // Apskaičiuokite offset
            offsetX = e.clientX - element.getBoundingClientRect().left; 
            offsetY = e.clientY - element.getBoundingClientRect().top; 
    
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;           
        };
    
        function elementDrag(e) {
            e.preventDefault();
            // Nustatome naują poziciją pagal pelės poziciją ir offset
            element.style.top = (e.clientY - offsetY) + "px"; 
            element.style.left = (e.clientX - offsetX) + "px"; 
        }
    
        function closeDragElement() {
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
        const animationDuration = 300; // Laikas (ms), atitinkantis animacijos trukmę
        const delayBetweenCells = 30; // Laikas (ms) tarp kiekvienos ląstelės animacijos pradžios
    
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
                // Pridėti fade-out klasę su vėlavimu
                for (let col = 0; col < gridWidth; col++) {
                    const index = row * gridWidth + col;
    
                    setTimeout(() => {
                        gridCells[index].classList.add('fade-out');
                    }, col * delayBetweenCells); // Vėlavimas pagal stulpelį
                }
    
                // Išvalyti po animacijos pabaigos
                setTimeout(() => {
                    for (let col = 0; col < gridWidth; col++) {
                        const index = row * gridWidth + col;
                        gridCells[index].style.backgroundColor = ''; // Išvalome spalvą
                        gridCells[index].classList.remove('fade-out'); // Pašaliname fade-out klasę
                    }
                }, gridWidth * delayBetweenCells + animationDuration); // Laikas (ms) iki ląstelių išvalymo
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
                // Pridėti fade-out klasę su vėlavimu
                for (let row = 0; row < gridHeight; row++) {
                    const index = row * gridWidth + col;
    
                    setTimeout(() => {
                        gridCells[index].classList.add('fade-out');
                    }, row * delayBetweenCells); // Vėlavimas pagal eilutę
                }
    
                // Išvalyti po animacijos pabaigos
                setTimeout(() => {
                    for (let row = 0; row < gridHeight; row++) {
                        const index = row * gridWidth + col;
                        gridCells[index].style.backgroundColor = ''; // Išvalome spalvą
                        gridCells[index].classList.remove('fade-out'); // Pašaliname fade-out klasę
                    }
                }, gridHeight * delayBetweenCells + animationDuration); // Laikas (ms) iki ląstelių išvalymo
            }
        }
    }
    
    
    function piecesPosition(){
        const pieces = [
            document.querySelector('.piece-1'), 
            document.querySelector('.piece-2'), 
            document.querySelector('.piece-3')
        ].filter(piece => piece !== null); // Filtruoti, kad liktų tik esami elementai

        const basePieceSpacing = 50;
        const currentWindowWidth = window.innerWidth;
        const currentWindowHeight = window.innerHeight;
        const gameGridWidth = gameGrid.getBoundingClientRect().width;
        const gameGridheight = gameGrid.getBoundingClientRect().height;

        let totaloWidth = 0;
        let totaloHeight = 0;

        pieces.forEach(piece=>{
            totaloWidth += piece.getBoundingClientRect().width;
        })
        totaloWidth += (pieces.length-1)*basePieceSpacing;

        pieces.forEach(piece=>{
            totaloHeight += piece.getBoundingClientRect().height;
        })
        totaloHeight += (pieces.length-1)*basePieceSpacing;

        let piecesStartX = (currentWindowWidth - totaloWidth) / 2;
        let piecesStartY = (gameGridheight - totaloHeight) / 2 + gameGrid.getBoundingClientRect().y;
        
        console.log(
            'piecesStartX.' + 
            '\n| currentWindowWidth: ' + currentWindowWidth,
            '\n| totaloWidth: ' + totaloWidth,
            '\n| piecesStartX: ' + piecesStartX,
        )

        piecesStartLeftIfNeedes = ((currentWindowWidth - 500) / 2) + gameGridWidth + 20;
        console.log('gameGridheight:' + gameGrid.getBoundingClientRect().y)
        
        if(currentWindowHeight < 776){
            pieces.forEach(piece=>{
                piece.style.top = `${piecesStartY}px`;
                piece.style.left = `${piecesStartLeftIfNeedes}px`;
                piecesStartY+=piece.getBoundingClientRect().height + basePieceSpacing;
                piece.dataset.initialTop = piecesStartY;
                piece.dataset.initialLeft = piecesStartLeftIfNeedes;

                console.log(
                    '\n| piece.style.top: ' + piece.style.top,
                    '\n| piecesStartY: ' + piecesStartY,
                    '\n| piece.dataset.initialLeft: ' + piece.dataset.initialLeft,
                )
        
            });
        }
        if(currentWindowHeight > 776){
            pieces.forEach(piece=>{
                piece.style.left = `${piecesStartX}px`;
                piecesStartX+=piece.getBoundingClientRect().width + basePieceSpacing;
                if (piece.getBoundingClientRect().height < 98) {
                    piece.style.top = '675px'; // Nustatyti fiksuotą poziciją
                    piece.dataset.initialTop = 675;
                } else {
                    piece.style.top = '650px';
                    piece.dataset.initialTop = 650;
                }
                
                piece.dataset.initialLeft = piecesStartX;
            });
        }
         


    }
    

    generateRandomPieces();
     // Pritaikyti pozicijas, kai ekrano dydis keičiasi
    window.addEventListener('resize', piecesPosition);

  

});
