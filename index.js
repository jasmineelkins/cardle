// const goalCardsArray = ["AS", "2S", "3S", "4S", "5S"];
const goalCardsArray = [];
const goalCardImagesArray = [];
const winningDiv = document.querySelector("#winningDiv");
const availableCardsDiv = document.getElementById("availableCardsDiv");

let currentGuessArray = [];
let guessCounter = 0;
let winning = false;

document.addEventListener("DOMContentLoaded", () => {
  appendGoalCards();
  setGoalCards();
  setAvailableCards();
  createGuessGrid();
});

function setAvailableCards() {
  fetch("https://deckofcardsapi.com/api/deck/new/")
  .then((response) => response.json())
  .then((data) => {
      const deckID = data.deck_id;
      fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=52`)
        .then((response) => response.json())
        .then((data) => {
          data.cards.forEach((element) => {
            const tempCard = document.createElement("div");
            tempCard.className = "guessableCards";

            const tempImg = document.createElement("img");
            tempImg.src = element.images.png;
            tempImg.addEventListener("click", (e) => {
              if (currentGuessArray.length <= 4) {
                if (!currentGuessArray.includes(element.code)) {
                  //console.log(element);
                  addGuess(e);
                }
              }
            });
            tempImg.id = element.code;
            tempCard.append(tempImg);
            availableCardsDiv.appendChild(tempCard);
          });
        });
    });
}

function setGoalCards() {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then((response) => response.json())
    .then((data) => {
      const goalDeckID = data.deck_id;

      fetch(`https://deckofcardsapi.com/api/deck/${goalDeckID}/draw/?count=5`)
        .then((response) => response.json())
        .then((data) => {
          data.cards.forEach((card) => {
            console.log(card.code); //leave in for testing
            const cardFace = document.createElement("img");
            cardFace.src = card.image;

            goalCardsArray.push(card.code);
            goalCardImagesArray.push(card.image);
          });
        });
    });
}

function appendGoalCards() {
  for (let i = 0; i < 5; i++) {
    const cardImg = document.createElement("img");
    cardImg.classList.add("cardBack");
    let thisGoal = document.querySelector(`#goal${i}`);

    if (!winning) {
      cardImg.src = "assets/card.png";
      thisGoal.append(cardImg);
    } else {
      cardImg.src = goalCardImagesArray[i];
      thisGoal.replaceChildren(cardImg);
    }
  }
}

function createGuessGrid() {
  const gridDiv = document.getElementById("allGuessedCardsDiv")

  for (let i = 0; i < 5; i++){
    const row = document.createElement('div')
    row.classList.add("guessed")
    row.id = `guessedCards${i}`
    for (let j = 0; j < 5; j++){
      const cell = document.createElement('div')
      cell.classList.add("guessBox", `guess${j}`)
      row.appendChild(cell)
    }
    gridDiv.append(row)
  }

}

function addGuess(e) {
  const guessedCardRow = document.querySelector(`#guessedCards${guessCounter}`)
  const guessedCardCell = guessedCardRow.querySelector(`.guess${currentGuessArray.length}`);

  const guessedCardImage = document.createElement("img");
  guessedCardImage.src = e.target.src;

  const currentID = e.target.id;
  currentGuessArray.push(currentID);
  guessedCardCell.classList.add(`guess${currentID}`, `guessedCard`);

  guessedCardImage.addEventListener("click", (e) => {
    const indexToRemove = currentGuessArray.indexOf(currentID);
    currentGuessArray.splice(indexToRemove, 1);
    e.target.remove();
  });

  guessedCardCell.append(guessedCardImage);
}

function handleSubmit(e) {
  const currentGuessRow = document.querySelector(`#guessedCards${guessCounter}`);

  const commonCards = goalCardsArray.filter((id) => {
    return currentGuessArray.includes(id);
  });

  if (commonCards.length === 5) {
    winning = true;
    appendGoalCards();
    availableCardsDiv.classList.add("hidden");
    winningDiv.classList.remove("hidden");
  } else {
    for (let i = 0; i < 5; i++){
        const currentGuessCell = currentGuessRow.querySelector(`.guess${i}`);
  
        const resultDiv = document.createElement("div");
        const valueDiv = document.createElement("div")
        const suitDiv = document.createElement("div")
        let suitMatch= false;
        let valueMatch = false;
        let allMatch = false;
  
  
        if (goalCardsArray.includes(currentGuessArray[i])) {
          // resultText.textContent = "IN";
          // resultText.classList.add("in");
          allMatch = true
          suitMatch = true
          valueMatch = true
          resultDiv.textContent = "CARDS"
        } else {
          valueMatch = currentGuessArray[i].startsWith(goalCardsArray[i][0])
          suitMatch = currentGuessArray[i][1] === goalCardsArray[i][1]
          // resultText.textContent = "NOT IN";
          // resultText.classList.add("notIn");
        }
        //currentGuessCell.appendChild(resultText);
        currentGuessCell.classList.add("blocked", "submitted");
        console.log("suit ", suitMatch, "value ", valueMatch, "all ", allMatch)
        resultDiv.classList.add("results")
        resultDiv.append(valueDiv, suitDiv)
        currentGuessCell.append(resultDiv)

      };

    
    // currentGuessArray.forEach((guess) => {
    //   const currentGuessCell = currentGuessRow.querySelector(`.guess${guess}`);

    //   const resultDiv = document.createElement("div");
    //   const valueDiv = document.createElement("div")
    //   const suitDiv = document.createElement("div")
    //   let suitMatch
    //   let valueMatch
    //   let allMatch


    //   if (goalCardsArray.includes(guess)) {
    //     // resultText.textContent = "IN";
    //     // resultText.classList.add("in");
    //     allMatch = true
    //   } else {
    //     goalCardsArray
    //     // resultText.textContent = "NOT IN";
    //     // resultText.classList.add("notIn");
    //   }
    //   currentGuessCell.appendChild(resultText);
    //   currentGuessCell.classList.add("blocked", "submitted");
    // });
  }
  currentGuessArray = [];
  guessCounter++;
  if (guessCounter === 5) {
    alert("you have no more guesses :(");
    submitBtn.classList.add("blocked");
  }
}


//put the buttons in the init function? or just they should live at top

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
