function createDeck() {
    let deck = [];
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks = ['4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace', '2', '3'];
    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({ rank, suit, img: `images/${rank.toLowerCase()}_of_${suit}.jpg` });
        }
    }
    return deck;
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function createCardDiv(card, cardIndex, cardType, playerIndex) {
    const cardDiv = document.createElement('img');
    cardDiv.classList.add('card', `${cardType}-card`);
    cardDiv.src = card.img;
    cardDiv.dataset.rank = card.rank;
    cardDiv.dataset.suit = card.suit;
    cardDiv.dataset.cardIndex = cardIndex;
    cardDiv.dataset.cardType = cardType;
    cardDiv.dataset.playerIndex = playerIndex;

    return cardDiv;
}

function createTimerElement() {
    const timerDiv = document.createElement('div');
    timerDiv.id = 'timer';
    document.body.insertBefore(timerDiv, document.body.firstChild);
    return timerDiv;
}

function getTopCardRank() {
    const playArea = document.getElementById('playArea');
    if (playArea.children.length === 0) {
        return ''; 
    }
    const topCard = playArea.children[playArea.children.length - 1];
    return topCard.dataset.rank;
}

function getCardValue(rank) {
    const rankValues = {
        '3': 13,
        '2': 12,
        'ace': 11,
        'king': 10,
        'queen': 9,
        'jack': 8,
        '10': 7,
        '9': 6,
        '8': 5,
        '7': 4,
        '6': 3,
        '5': 2,
        '4': 1
    };
    return rankValues[rank];
}

const SPECIAL_CARDS = {
    '7': 'LOWER_NEXT',
    '9': 'SKIP',
    '10': 'BOMB',
    '2': 'RESET',
    '3': 'ATTACK'
};
