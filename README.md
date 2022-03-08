# cardle

wordle - but with CARDS!

---

Variation of Wordle- cards? poker hands?
https://deckofcardsapi.com

Visual: show all cards on the bottom of the screen

TO START:
ONE SUIT OF CARDS = ONE ARRAY 5 x 5 “grid” of divs (hardcoded)
User clicks 5 cards, click adds to currentGuess array.
Then clicks ‘Submit’ which compares currentGuess array to goalArray & changes boolean inGoalArray to true/false
Changing that bool updates the color of the card
Also need a counter variable to dictate which of the row of the grid the guesses go into
**Need persistance**

goalArray[] array containing 5 hardcoded cards to match
currentGuess[] array containing 5 cards chosen by the user - click event moves these cards to the array

Computer “knows 5 cards” but they are hidden
User inputs 5 possible cards as guesses, the computer will compare and announce:
Gets feedback “these 3 cards are a match” etc

52 cards (clickable? Or typed in?)
Y/N the card is “in”

STRETCH GOALS:
Expand to 2 suits
The number AND suit is matched
Expand to all 4 suits
Randomize the 5 chosen cards -> drawing randomly from API

Using external API, find a deck of cards & poker hands
Each time you load, the API resets
(Maybe extra stretch metrics would be to have this load every time?)

---

Image credits:
spade: https://svg-clipart.com/symbol/qqBY3LM-spade-symbol-clipart
heart: https://svg-clipart.com/symbol/X5sOrFB-heart-symbol-clipart
diamond: https://svg-clipart.com/symbol/EfO6f7N-single-diamond-clipart
club:
