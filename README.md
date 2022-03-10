# qardle

wordle - but with CARDS!

---

QARDLE! is a guessing game designes & built by Calypso Leonard and Jasmine Elkins in March 2022 as an assignment for Flatiron School's Software Engineering Bootcamp. The concept is based on the popular New York Times game "Wordle".

Our original idea was to build a game similar to "Wordle" but using cards and poker hands instead of letters and words. However after building and playing the game a few times, we enjoyed the challenge of a random matching game and decided against incorporating poker hand logic. We completed the project over the course of 6 days, taking approximately 20 hours.

PROJECT REQUIREMENTS:

- Your app must be a HTML/CSS/JS frontend that accesses data from a public API. All interactions between the client and the API should be handled asynchronously and use JSON as the communication format.
- Your entire app must run on a single page. There should be NO redirects. In other words, your project will contain a single HTML file.
- Your app needs to incorporate at least 3 separate event listeners (DOMContentLoaded, click, change, submit, etc).
- Some interactivity is required. This could be as simple as adding a "like" button or adding comments. These interactions do not need to persist after reloading the page.
- Follow good coding practices. Keep your code DRY (Do not repeat yourself) by utilizing functions to abstract repetitive code.

---

INITIAL DESIGN & OBJECTIVES:

- Create sections to show available cards at the bottom of the screen, guessed cards in the middle, and goal cards at the top
- Goal cards are hidden from the player
- Start with 5 hardcoded goal cards and only one suit available, to set up gameplay functions
- After each turn, cards display "In" or "Not In" to alert player if they are one of the goal cards
- Player can not submit more than 5 guesses per turn
- Player can not submit the same card more than once per turn
- After 5 turns the game is over

STRETCH OBJECTIEVES:

- Expand to 2 suits
- Determine if both number AND suit are matched - display on card
- Expand to all 4 suits
- Randomize the 5 goal cards by drawing randomly from API
- Add FAQ button to display rules
- Animate cards at game end - specific to winning or losing
- Add a "Give Up?" button to end game and reveal goal cards
- After receiving user feedback that the green/red color scheme is not accessibility-friendly, we added a button to toggle contrast mode
- Add a "Hint" button to assist players if they're stuck
- Use a json server (or potentially localStorage?) to add persistence to the app

---

LEARNINGS:

- pair programming
- game logic
- object manipulation
- using fetch requests & APIs
- variables & scope
- functions
- event listeners
- CSS styling
- CSS animation
- troubleshooting and debugging
- GitHub workflow & version control

---

Credits:
Free card deck API:
https://deckofcardsapi.com

Card suit images:
spade: https://svg-clipart.com/symbol/qqBY3LM-spade-symbol-clipart
heart: https://svg-clipart.com/symbol/X5sOrFB-heart-symbol-clipart
diamond: https://svg-clipart.com/symbol/EfO6f7N-single-diamond-clipart
club:
