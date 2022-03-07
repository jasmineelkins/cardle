// const goalCardsArray = ["AS", "2S", "3S", "4S", "5S"];
const goalCardsArray = [];
const goalCardImagesArray = [];
const winningDiv = document.querySelector("#winningDiv");
const availableCardsDiv = document.getElementById("availableCardsDiv");

let currentGuessArray = [];
let deckID;
let guessCounter = 0;
let winning = false;

document.addEventListener("DOMContentLoaded", () => {
  appendCardBacks();

  function setGoalCards() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        const goalDeckID = data.deck_id;

        fetch(`https://deckofcardsapi.com/api/deck/${goalDeckID}/draw/?count=5`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);

            data.cards.forEach((card) => {
              const cardFace = document.createElement("img");
              cardFace.src = card.image;

              goalCardsArray.push(card.code);
              goalCardImagesArray.push(card.image);
              // console.log(goalCardImagesArray);

              // if (winning) {
              //   for (let i = 0; i < 5; i++) {
              //     cardFace.classList.add("cardBack");

              //     let thisGoal = document.querySelector(`#goal${i}`);
              //     thisGoal.append(cardFace);
              //   }
              // }
            });
          });
      });
  }

  setGoalCards();

  fetch("https://deckofcardsapi.com/api/deck/new/")
    .then((response) => response.json())
    .then((data) => {
      deckID = data.deck_id;
      fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`)
        .then((response) => response.json())
        .then((data) => {
          //console.log(data.cards)
          data.cards.forEach((element) => {
            //console.log(element)
            const tempCard = document.createElement("div");
            tempCard.className = "guessableCards";

            const tempImg = document.createElement("img");
            tempImg.src = element.images.png;
            tempImg.addEventListener("click", (e) => {
              if (currentGuessArray.length <= 4) {
                if (!currentGuessArray.includes(element.code)) {
                  //console.log(currentGuessArray)
                  console.log(element);
                  addGuess(e);
                }
              }
            });
            tempImg.id = element.code;
            //console.log(tempImg.id)
            tempCard.append(tempImg);
            availableCardsDiv.appendChild(tempCard);
          });
        });
    });
});

// placeholder card back images
function appendCardBacks() {
  for (let i = 0; i < 5; i++) {
    const cardBack = document.createElement("img");
    cardBack.src = "assets/card.png";
    cardBack.classList.add("cardBack");

    let thisGoal = document.querySelector(`#goal${i}`);
    thisGoal.append(cardBack);
  }
}

function appendGoalCards() {
  for (let i = 0; i < 5; i++) {
    const goalCard = document.createElement("img");
    goalCard.src = goalCardImagesArray[i];
    goalCard.classList.add("cardBack");

    let thisGoal = document.querySelector(`#goal${i}`);
    thisGoal.replaceChildren(goalCard);
  }
}

function createGuessGrid() {
  // is it better to add grid dynamically?
}

const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", (e) => {
  // alert if guess array length is < 5 don't take more guesses
  if (currentGuessArray.length < 5) {
    alert("You need 5 cards to guess");
  } else {
    handleSubmit(e);
  }
});

const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  document.location.reload();
});

function addGuess(e) {
  const guessedCardDiv = document.createElement("div");

  const guessedCardImage = document.createElement("img");
  guessedCardImage.src = e.target.src;

  const currentID = e.target.id;
  currentGuessArray.push(currentID);
  guessedCardDiv.classList.add(`guess${currentID}`, `guessedCard`);

  guessedCardImage.addEventListener("click", (e) => {
    const indexToRemove = currentGuessArray.indexOf(currentID);
    currentGuessArray.splice(indexToRemove, 1);
    e.target.parentNode.remove();
  });

  const guessedCardSpace = document.getElementById(
    `guessedCards${guessCounter}`
  );

  guessedCardDiv.append(guessedCardImage);
  guessedCardSpace.appendChild(guessedCardDiv);

  //if top id == bottom id (ie AD, 2D), then toggle mouseclick/pointer event
}

function handleSubmit(e) {
  const currentGuessDiv = document.querySelector(
    `#guessedCards${guessCounter}`
  );
  const commonCards = goalCardsArray.filter((id) => {
    return currentGuessArray.includes(id);
  });
  if (commonCards.length === 5) {
    // winning = true;
    appendGoalCards();
    // alert("YOU WON!!!");
    availableCardsDiv.classList.add("hidden");
    winningDiv.classList.remove("hidden");
  } else {
    currentGuessArray.forEach((guess) => {
      const resultText = document.createElement("p");
      const thisGuessDiv = currentGuessDiv.querySelector(`.guess${guess}`);
      if (goalCardsArray.includes(guess)) {
        resultText.textContent = "IN";
        resultText.classList.add("in");
        //thisGuessDiv.append(resultText)
      } else {
        resultText.textContent = "NOT IN";
        resultText.classList.add("notIn");
      }
      thisGuessDiv.appendChild(resultText);
      thisGuessDiv.classList.add("blocked");
    });
  }
  currentGuessArray = [];
  guessCounter++;
  if (guessCounter === 5) {
    alert("you have no more guesses :(");
    submitBtn.classList.add("blocked");
  }
}
