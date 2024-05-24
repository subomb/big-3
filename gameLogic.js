
let deck = [];
let lowerNextActive = false; 
let resetPlayPileValue = false; 
let players = [];
let currentPlayerIndex = 0; 
let selectedCards = [];
let lastFourCards = []; 

document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    startGameButton.addEventListener('click', function() {
        const playerCount = prompt("Enter the number of players (2-9):"); 
        if (playerCount >= 2 && playerCount <= 9) {
            startGame(parseInt(playerCount));
        } else {
            alert("Invalid number of players. Please enter a number between 2 and 9.");
        }
    });
});

function initializeSwapPhase(players) {
    players.forEach((player, playerIndex) => {
        player.knownCardListeners = [];
        player.handCardListeners = [];
        
        const knownCards = document.querySelectorAll(`#player${playerIndex + 1} .known-cards .card`);
        const handCards = document.querySelectorAll(`#player${playerIndex + 1} .hand-cards .card`);

        knownCards.forEach((card, index) => {
            const listener = () => selectCard(card, playerIndex, 'known', index);
            card.addEventListener('click', listener);
            player.knownCardListeners.push(listener); 
        });

        handCards.forEach((card, index) => {
            const listener = () => selectCard(card, playerIndex, 'hand', index);
            card.addEventListener('click', listener);
            player.handCardListeners.push(listener); 
        });
    });

    const timerDisplay = document.getElementById('timer') || createTimerElement();
    let timeRemaining = 15; 

    const timerInterval = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = `Timer: ${timeRemaining < 10 ? '0' : ''}${timeRemaining}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endSwapPhase(players);
        }
    }, 1000);

    function selectCard(cardElement, playerIndex, cardType) {
        if (cardElement.classList.contains('selected')) {
            cardElement.classList.remove('selected');
        } else {
            const alreadySelectedCard = document.querySelector('.selected');
            if (alreadySelectedCard) {
                swapCards(alreadySelectedCard, cardElement, players[playerIndex]);
                alreadySelectedCard.classList.remove('selected');
            } else {
                cardElement.classList.add('selected');
            }
        }
    }

    function swapCards(card1, card2, player) {
        const card1Index = parseInt(card1.dataset.cardIndex);
        const card2Index = parseInt(card2.dataset.cardIndex);

        if (card1.dataset.cardType === 'known' && card2.dataset.cardType === 'hand') {
            [player.known[card1Index], player.hand[card2Index]] = [player.hand[card2Index], player.known[card1Index]];
        } else if (card1.dataset.cardType === 'hand' && card2.dataset.cardType === 'known') {
            [player.hand[card1Index], player.known[card2Index]] = [player.known[card2Index], player.hand[card1Index]];
        }

        card1.src = player[card1.dataset.cardType][card1Index].img;
        card2.src = player[card2.dataset.cardType][card2Index].img;
        card1.dataset.rank = player[card1.dataset.cardType][card1Index].rank;
        card1.dataset.suit = player[card1.dataset.cardType][card1Index].suit;
        card2.dataset.rank = player[card2.dataset.cardType][card2Index].rank;
        card2.dataset.suit = player[card2.dataset.cardType][card2Index].suit;
    }
}

function endSwapPhase(players) {
    cleanupSwapPhaseUI(players);

    startPlayerTurns(players);
}

function cleanupSwapPhaseUI(players) {
    players.forEach((player, playerIndex) => {
        const knownCards = document.querySelectorAll(`#player${playerIndex + 1} .known-cards .card`);
        const handCards = document.querySelectorAll(`#player${playerIndex + 1} .hand-cards .card`);

        knownCards.forEach((card, index) => {
            if (player.knownCardListeners[index]) {
                card.removeEventListener('click', player.knownCardListeners[index]);
            }
        });
        handCards.forEach((card, index) => {
            if (player.handCardListeners[index]) {
                card.removeEventListener('click', player.handCardListeners[index]);
            }
        });

        player.knownCardListeners = [];
        player.handCardListeners = [];
    });

    document.querySelectorAll('.selected').forEach(card => card.classList.remove('selected'));
    alert('Swapping phase is over. Proceed with the game.');
}

function startPlayerTurns(players) {
    currentPlayerIndex = 0; 
    enablePlayerMoves(players, currentPlayerIndex);
    console.log(`Player ${currentPlayerIndex + 1}'s turn starts.`);
}
