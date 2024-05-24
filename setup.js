function startGame(playerCount) {
    deck = createDeck(); 
    if (playerCount > 4) {
        deck = deck.concat(createDeck()); 
    }
    shuffle(deck);
    players = [];
    for (let i = 0; i < playerCount; i++) {
        players.push({ index: i, known: [], unknown: [], hand: [], handCardListeners: [] });
    }
    distributeCards(deck, players);
    initializeSwapPhase(players); 
}

function distributeCards(deck, players) {
    const drawPileDiv = document.getElementById('drawPile');
    const playersAreaDiv = document.getElementById('playersArea');
    
    playersAreaDiv.innerHTML = '';
    drawPileDiv.textContent = `Draw Pile: ${deck.length}`;

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        player.unknown.push(deck.pop(), deck.pop());
        player.known.push(deck.pop(), deck.pop());
        
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        playerDiv.id = 'player' + (i + 1);

        const playerLabel = document.createElement('h3');
        playerLabel.textContent = `Player ${i + 1}`;
        playerDiv.appendChild(playerLabel);       

        const knownAndUnknownRowDiv = document.createElement('div');
        knownAndUnknownRowDiv.classList.add('card-row');

        const knownCardsDiv = document.createElement('div');
        knownCardsDiv.classList.add('known-cards');
        player.known.forEach((card, index) => {
            const cardDiv = createCardDiv(card, index, 'known', i);
            knownCardsDiv.appendChild(cardDiv);
        });
        knownAndUnknownRowDiv.appendChild(knownCardsDiv);

        const unknownCardsDiv = document.createElement('div');
        unknownCardsDiv.classList.add('unknown-cards');
        for (let j = 0; j < player.unknown.length; j++) {
            const cardDiv = createCardDiv({ rank: 'back', suit: 'back', img: 'images/card-back-red.jpg' }, j, 'unknown', i);
            unknownCardsDiv.appendChild(cardDiv);
        }
        knownAndUnknownRowDiv.appendChild(unknownCardsDiv);

        playerDiv.appendChild(knownAndUnknownRowDiv);

        for (let cardCount = 0; cardCount < 7; cardCount++) {
            player.hand.push(deck.pop());
        }

        const handCardsDiv = document.createElement('div');
        handCardsDiv.classList.add('hand-cards');
        player.hand.forEach((card, index) => {
            const cardDiv = createCardDiv(card, index, 'hand', i);
            handCardsDiv.appendChild(cardDiv);
        });
        playerDiv.appendChild(handCardsDiv);

        const doneButton = document.createElement('button');
        doneButton.textContent = 'Done';
        doneButton.id = 'doneButton' + i; 
        doneButton.style.display = 'none'; 
        playerDiv.appendChild(doneButton);
        playersAreaDiv.appendChild(playerDiv);
    }

    drawPileDiv.textContent = `Draw Pile: ${deck.length}`;
}
