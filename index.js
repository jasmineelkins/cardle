const goalCardsArray = [];
let currentGuessArray = [];

let guessCounter = 0;

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://deckofcardsapi.com/api/deck/new/")
    .then((response) => response.json())
    .then((data) => console.log(data));
});
