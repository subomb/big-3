function playSpecialCard(card, player, players) {
    switch (SPECIAL_CARDS[card.rank]) {
        case 'LOWER_NEXT':
            handleLowerNext(player, players);
            break;
        case 'SKIP':
            handleSkip(player, players);
            break;
        case 'BOMB':
            handleBomb(player, players);
            break;
        case 'RESET':
            handleReset(player, players);
            break;
        case 'ATTACK':
            handleAttack(player, players);
            break;
        default:
            console.error('Unknown special card:', card.rank);
    }
}

function handleLowerNext(player, players) {
    console.log(`${player.index + 1} played a 7. The next player can play a card lower than or equal to 7.`);
    lowerNextActive = true; 
}

function handleSkip(player, players, numOfNines) {
    drawCard(player, numOfNines);
    
    endTurn(false); 
}

function handleBomb(player, players) {
    console.log(`${player.index + 1} played a 10. Bombing the play pile.`);
    const playArea = document.getElementById('playArea');
    while (playArea.firstChild) {
        playArea.removeChild(playArea.firstChild);
    }
    console.log(`Player ${player.index + 1}'s turn starts again.`);
}

function handleReset(player, players) {
    console.log(`${player.index + 1} played a 2. Resetting the play pile value.`);
    resetPlayPileValue = true;
}

function handleAttack(player, players, cardRank) {
    console.log(`${player.index + 1} played a 3. Forcing the next player to pick up the play pile unless they have a 3.`);
    
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextPlayer = players[nextPlayerIndex];
    const playArea = document.getElementById('playArea');
    let canCounter = false;

    nextPlayer.hand.forEach(card => {
        if (card.rank === '3') {
            canCounter = true;
        }
    });

    if (canCounter) {
        console.log(`Player ${nextPlayerIndex + 1} can counter with a 3.`);
        return ['3'].includes(cardRank);
    } else {
        console.log(`Player ${nextPlayerIndex + 1} cannot counter and must pick up the play pile.`);
        drawCard(player, 1);
        takePlayPile(nextPlayer, players);   
    }
}