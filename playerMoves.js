function enablePlayerMoves(players, currentPlayerIndex) {
    console.log(`Enabling moves for Player ${currentPlayerIndex + 1}`);
    const currentPlayer = players[currentPlayerIndex];
    selectedCards = []; 

    if (!currentPlayer.handCardListeners) {
        currentPlayer.handCardListeners = [];
    }
    currentPlayer.handCardListeners = []; 
    const handCards = document.querySelectorAll(`#player${currentPlayerIndex + 1} .hand-cards .card`);
    const knownCards = document.querySelectorAll(`#player${currentPlayerIndex + 1} .known-cards .card`);
    const unknownCards = document.querySelectorAll(`#player${currentPlayerIndex + 1} .unknown-cards .card`);

    const topCardRank = getTopCardRank(); 

    function canPlayCard(cardRank) {
        if (resetPlayPileValue) {
            return true;
        }
        if (lowerNextActive) {
            return ['4', '5', '6', '7'].includes(cardRank);
        }
        if (!topCardRank) return true;
        return getCardValue(cardRank) >= getCardValue(topCardRank);
    }

    function selectCard(card) {
        card.classList.toggle('selected');
        const cardIndex = selectedCards.findIndex(selectedCard => selectedCard === card);
        if (cardIndex === -1) {
            selectedCards.push(card);
            console.log(`Selected cards: ${selectedCards.map(c => c.src).join(', ')}`);
        } else {
            selectedCards.splice(cardIndex, 1);
            console.log(`Selected cards: ${selectedCards.map(c => c.src).join(', ')}`);
        }
    }

    if (currentPlayer.hand.length > 0) {
        handCards.forEach(card => {
            const cardRank = card.dataset.rank;
            if (canPlayCard(cardRank)) {
                const selectHandler = function() { selectCard(card); };
                card.addEventListener('click', selectHandler);
                currentPlayer.handCardListeners.push({ card: card, handler: selectHandler });
            }
        });
    } else if (currentPlayer.known.length > 0) {
        knownCards.forEach(card => {
            const cardRank = card.dataset.rank;
            if (canPlayCard(cardRank)) {
                const selectHandler = function() { selectCard(card); };
                card.addEventListener('click', selectHandler);
                currentPlayer.handCardListeners.push({ card: card, handler: selectHandler });
            }
        });
    } else {
        unknownCards.forEach(card => {
            const cardData = currentPlayer.unknown[card.dataset.cardIndex];
            card.src = cardData.img; 
            const cardRank = cardData.rank;
            if (canPlayCard(cardRank)) {
                const selectHandler = function() { selectCard(card); };
                card.addEventListener('click', selectHandler);
                currentPlayer.handCardListeners.push({ card: card, handler: selectHandler });
            }
        });
    }

    document.querySelectorAll('button.play-selected-cards, button.take-play-pile').forEach(button => button.remove());

    const playButton = document.createElement('button');
    playButton.textContent = 'Play Selected Cards';
    playButton.classList.add('play-selected-cards');
    playButton.onclick = () => playSelectedCards(currentPlayer, players);
    document.getElementById(`player${currentPlayerIndex + 1}`).appendChild(playButton);

    if (document.getElementById('playArea').children.length > 0) {
        const takePlayPileButton = document.createElement('button');
        takePlayPileButton.textContent = 'Take Play Pile';
        takePlayPileButton.classList.add('take-play-pile');
        takePlayPileButton.onclick = () => takePlayPile(currentPlayer, players);
        document.getElementById(`player${currentPlayerIndex + 1}`).appendChild(takePlayPileButton);
    }
}

function disablePlayerMoves(playerIndex, players) {
    console.log(`Disabling moves for Player ${playerIndex + 1}`);
    const currentPlayer = players[playerIndex];
    if (!currentPlayer || !currentPlayer.handCardListeners) {
        console.error('Invalid player index or listener storage:', playerIndex);
        return;
    }
    currentPlayer.handCardListeners.forEach(({ card, handler }) => {
        card.removeEventListener('click', handler); 
        card.classList.add('disabled'); 
    });
    currentPlayer.handCardListeners = []; 

    const playButton = document.querySelector(`#player${playerIndex + 1} button.play-selected-cards`);
    if (playButton) {
        playButton.remove();
    }
}

function playSelectedCards(player, players) {
    if (selectedCards.length === 0) {
        alert("No cards selected.");
        return;
    }

    const selectedCardRanks = selectedCards.map(card => card.dataset.rank);
    const uniqueRanks = [...new Set(selectedCardRanks)];

    if (uniqueRanks.length > 1) {
        alert("You can only play cards of the same rank.");
        deselectAllCards();
        return;
    }

    const cardRank = uniqueRanks[0];

    if (cardRank === '3' && selectedCards.length > 1) {
        alert("You cannot play more than one 3 at a time.");
        deselectAllCards(); 
        return;
    }

    if (!canPlaySelectedCards(cardRank)) {
        alert("Selected cards cannot be played.");
        deselectAllCards(); 
        return;
    }

    let bombPlayed = false; 
    let lowerNextRuleCarried = false; 
    let numOfNines = 0; 
    let attackHandled = false; 

    selectedCards.forEach(card => {
        console.log(`Player ${player.index + 1} played ${card.dataset.rank} of ${card.dataset.suit}`);
        const cardClone = card.cloneNode(true);
        playArea.appendChild(cardClone); 

        const cardCount = playArea.children.length;
        const positionInLayer = (cardCount - 1) % 6;
        const layerIndex = Math.floor((cardCount - 1) / 6);

        cardClone.style.setProperty('--x-offset', `${positionInLayer * 30}px`);
        cardClone.style.setProperty('--y-offset', `${layerIndex * 10}px`);

        let cardIndex = -1;
        let playedCard = null;
        if (player.hand.length > 0) {
            cardIndex = player.hand.findIndex(c => c.rank === card.dataset.rank && c.suit === card.dataset.suit);
            if (cardIndex > -1) {
                playedCard = player.hand.splice(cardIndex, 1)[0];
            }
        } else if (player.known.length > 0) {
            cardIndex = player.known.findIndex(c => c.rank === card.dataset.rank && c.suit === card.dataset.suit);
            if (cardIndex > -1) {
                playedCard = player.known.splice(cardIndex, 1)[0];
            }
        }
        if (playedCard && SPECIAL_CARDS[playedCard.rank]) {
            if (playedCard.rank === '9') {
                numOfNines++; 
            }
            if (playedCard.rank === '3' && !attackHandled) {
                handleAttack(player, players);
                attackHandled = true;
            } else if (playedCard.rank !== '3') { 
                playSpecialCard(playedCard, player, players);
            }
            if (playedCard.rank === '10') {
                bombPlayed = true; 
            }
            if (playedCard.rank === '7') {
                lowerNextRuleCarried = true;
            }
        }

        if (playedCard && playedCard.rank === '2') {
            resetPlayPileValue = true;
        } else {
            resetPlayPileValue = false;
        }

        lastFourCards.push(cardClone);
        if (lastFourCards.length > 4) {
            lastFourCards.shift(); 
        }
    });

    if (lastFourCards.length === 4 && lastFourCards.every(c => c.dataset.rank === cardRank)) {
        console.log(`Bomb! Four ${cardRank}s played consecutively.`);
        const playArea = document.getElementById('playArea');
        while (playArea.firstChild) {
            playArea.removeChild(playArea.firstChild);
        }
        lastFourCards = [];
        bombPlayed = true;
        lowerNextActive = false; 
    }

    drawCard(player, selectedCards.length);
    updatePlayerHandDisplay(player); 

    selectedCards.forEach(card => card.classList.remove('selected'));
    selectedCards = [];

    if (!bombPlayed) {
        if (numOfNines > 0) {
            handleSkip(player, players, numOfNines); 
        } else {
            endTurn(lowerNextRuleCarried); 
        }
    } else {
        enablePlayerMoves(players, player.index); 
    }
}

function deselectAllCards() {
    selectedCards.forEach(card => card.classList.remove('selected'));
    selectedCards = [];
}

function canPlaySelectedCards(cardRank) {
    const topCardRank = getTopCardRank();
    if (resetPlayPileValue) {
        return true;
    }
    if (lowerNextActive) {
        return ['4', '5', '6', '7'].includes(cardRank);
    }
    if (!topCardRank) return true;
    return getCardValue(cardRank) >= getCardValue(topCardRank);
}

function drawCard(player, numCards) {
    for (let i = 0; i < numCards; i++) {
        if (deck.length > 0) {
            const card = deck.pop();
            player.hand.push(card);
            console.log(`Player ${player.index + 1} draws ${card.rank} of ${card.suit}`);
        }
    }
    updatePlayerHandDisplay(player);
    updateDrawPileCount();
}

function updatePlayerHandDisplay(player) {
    const handDiv = document.getElementById(`player${player.index + 1}`).querySelector('.hand-cards');
    const knownDiv = document.getElementById(`player${player.index + 1}`).querySelector('.known-cards');
    const unknownDiv = document.getElementById(`player${player.index + 1}`).querySelector('.unknown-cards');
    
    handDiv.innerHTML = ''; 
    knownDiv.innerHTML = ''; 
    unknownDiv.innerHTML = ''; 

    player.hand.forEach((card, index) => {
        const cardDiv = createCardDiv(card, index, 'hand', player.index);
        handDiv.appendChild(cardDiv);
    });

    player.known.forEach((card, index) => {
        const cardDiv = createCardDiv(card, index, 'known', player.index);
        knownDiv.appendChild(cardDiv);
    });

    player.unknown.forEach((card, index) => {
        const cardDiv = createCardDiv({ rank: 'back', suit: 'back', img: 'images/card-back-red.jpg' }, index, 'unknown', player.index);
        unknownDiv.appendChild(cardDiv);
    });
}

function updateDrawPileCount() {
    const drawPileDiv = document.getElementById('drawPile');
    drawPileDiv.textContent = `Draw Pile: ${deck.length}`;
}

function endTurn(lowerNextRuleCarried) {
    disablePlayerMoves(currentPlayerIndex, players);

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

    if (!lowerNextRuleCarried) {
        lowerNextActive = false; 
    }

    enablePlayerMoves(players, currentPlayerIndex);

    console.log(`Player ${currentPlayerIndex + 1}'s turn starts.`);
}

function takePlayPile(player, players) {
    const playArea = document.getElementById('playArea');
    if (playArea.children.length === 0) {
        alert("The play pile is empty. You cannot take the pile.");
        return;
    }
    
    const pileCards = [];

    const playAreaChildren = Array.from(playArea.children);
    for (let cardDiv of playAreaChildren) {
        const rank = cardDiv.dataset.rank;
        if (rank !== '3') {
            pileCards.push({ rank, suit: cardDiv.dataset.suit, img: cardDiv.src });
        }
        playArea.removeChild(cardDiv);
    }
 
    player.hand = player.hand.concat(pileCards);
    updatePlayerHandDisplay(player);
    updateDrawPileCount();

    endTurn(false);
}
