# Big 3

Welcome to **Big 3**! This is a multiplayer card game designed for 2-10 players. The game involves strategic playing of cards with special rules and effects. The objective is to be the first to discard all your cards.

## Game Overview

### Players

- **Number of Players:** 2-10
- **Deck:** 
  - If 2-4 players: Use one deck of 50 cards (no Jokers)
  - If 5-10 players: Use two decks of 50 cards each

### Setup

1. Each player starts with 2 unknown cards and 2 known cards placed on the table.
2. Each player receives 7 additional cards in hand, dealt one at a time from the draw pile.

### Objective

The goal is to be the first player to discard all cards in your hand and on the table.

### Playing Cards

- Cards can be played as singles, doubles, triples, or quadruples.
- Players must play cards that match or exceed the rank of the top card of the play pile or use a special card to alter the gameplay.

### Drawing Cards

- After playing, a player must draw the same number of cards from the draw pile as they played, until the draw pile is depleted.

### End of Draw Pile

Once the draw pile is depleted, players continue without drawing additional cards.

### Card Swapping

Before the game starts, players may swap any of the two known cards on the table with cards from their hand.

### Special Card Rules

- **7:** Temporarily lowers the required card value for the next player. The next player can play a card that is equal to or lower than 7 (e.g., 7, 6, 5, 4).
- **9:** Skips one or more players, depending on the number of 9s played.
- **10 ("Bomb"):** Clears the current play pile to the discard pile.
- **2 ("Reset"):** Resets the play pile value to zero; the next card played can be any value.
- **3 ("Attack"):** The highest playable card that forces the next player to pick up the play pile unless they can play another 3. If the player does not have a 3, they take the play pile cards, and their turn is skipped.

### Bomb Rule

If four cards of the same rank are played consecutively, it counts as a "bomb." This clears the play pile, and the player who completed the bomb gets an extra turn.

### Card Ranking

- **Highest to Lowest:**
  - 3 -> 2 -> Ace -> King -> Queen -> Jack -> 10 -> 9 -> 8 -> 7 -> 6 -> 5 -> 4

## Game Strategy

- **Strategic Play:** Players need to strategically decide when to play higher cards or special cards.
- **Use of Special Cards:** Timing the use of special cards like bombs, resets, and attacks is crucial.
- **Endgame Tactics:** As the draw pile diminishes, players should plan to use their remaining cards effectively to outlast their opponents.

## How to Run the Game

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge, etc.)

### Instructions

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/big-3.git
    ```

2. Navigate to the project directory:

    ```bash
    cd big-3
    ```

3. Open the `index.html` file in your web browser.

## File Structure

- `index.html`: The main HTML file containing the structure of the game.
- `styles.css`: The CSS file containing styles for the game.
- `utils.js`: JavaScript file containing utility functions.
- `setup.js`: JavaScript file for setting up the game and distributing cards.
- `playerMoves.js`: JavaScript file for handling player moves.
- `specialCards.js`: JavaScript file for handling special card rules.
- `gameLogic.js`: JavaScript file containing the main game logic.

## Future Improvements

Here are some ideas for future improvements to the game:

- **Multiplayer Support:** Implement real-time multiplayer functionality using WebSockets to allow players to connect and play over the internet.
- **AI Opponents:** Add AI opponents to enable single-player mode.
- **Improved UI:** Enhance the user interface with more animations and visual effects.
- **Mobile Support:** Optimize the game for mobile devices to allow for playing on the go.

## Contributing

Feel free to fork this project, submit issues, and pull requests. Contributions are welcome!

## Acknowledgements

- Inspired by various card games and the desire to create my own unique multiplayer card game experience.

Enjoy the game and have fun!
