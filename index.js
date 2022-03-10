const goalCardsArray = [];
const goalCardImagesArray = [];
const availableCardsDiv = document.getElementById("availableCardsDiv");

let currentGuessArray = ["none","none","none","none","none"];
let guessCounter = 0;
let rowGuessCounter = 0;
let gameEnd = false;
let losing = true;
let contrastMode = false;

document.addEventListener("DOMContentLoaded", () => {
  appendGoalCards();
  setGoalCards();
  setAvailableCards();
  createGuessGrid();
  populateButtons();
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
              //console.log(currentGuessArray.includes("none"))
              if (currentGuessArray.includes("none")) {
                //if there are no empty strings in array 
                // !currentGuessArray.includes("")
                if (!currentGuessArray.includes(element.code)) {
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

    if (!gameEnd) {
      cardImg.src = "assets/card.png";
      thisGoal.append(cardImg);
    } else if (losing) {
      cardImg.src = goalCardImagesArray[i];
      thisGoal.replaceChildren(cardImg);
      cardImg.classList.add("losing");
      cardImg.style = "animation-delay: " + i * 0.2 + "s";
    } else if (!losing) {
      cardImg.src = goalCardImagesArray[i];
      thisGoal.replaceChildren(cardImg);
      cardImg.classList.add("winning");
      cardImg.style = "animation-delay: " + i * 0.2 + "s";
    }
  }
}

function createGuessGrid() {
  const gridDiv = document.getElementById("allGuessedCardsDiv");

  for (let i = 0; i < 5; i++) {
    const row = document.createElement("div");
    row.classList.add("guessed");
    row.id = `guessedCards${i}`;
    for (let j = 0; j < 5; j++) {
      const cell = document.createElement("div");
      cell.classList.add("guessBox", `guess${j}`);
      cell.id = `cell${i}${j}`
      row.appendChild(cell);
    }
    gridDiv.append(row);
  }
}

function addGuess(e) {
  //console.log(e)
  //if a card gets clicked and it is in a cell that is less than currentguessarray.length - 1, the next card needs to be appended to that cell, then return to .guess${cGA.length}
  //if the first child is a guessed card, move on the next sibling that does not have .guessedcard in classlist
  const guessedCardRow = document.querySelector(`#guessedCards${guessCounter}`);
  //console.log( `#cell${guessCounter}${rowGuessCounter}`)
  let guessedCardCell = guessedCardRow.querySelector(
    `#cell${guessCounter}${rowGuessCounter}`
  );

  while (guessedCardCell.classList.value.includes("guessedCard")){
    guessedCardCell = guessedCardCell.previousSibling
  }
  const inputCellNum = guessedCardCell.id[5]
  //console.log(inputCellNum)

  const guessedCardImage = document.createElement("img");
  guessedCardImage.src = e.target.src;

  const currentID = e.target.id;
  currentGuessArray[inputCellNum] = currentID;
  //console.log(currentGuessArray)
  guessedCardCell.classList.add(`guess${currentID}`, `guessedCard`);

  //REMOVE CARD IF CLICKED
  guessedCardImage.addEventListener("click", (e) => {
    const removedBox = e.target.parentNode
    removedBox.classList.remove("guessedCard",`guess${currentID}`)
    const indexToRemove = currentGuessArray.indexOf(currentID);
    //currentGuessArray.splice(indexToRemove, 1);
    currentGuessArray[indexToRemove] = "none";
    //console.log(currentGuessArray)
    e.target.remove();
    rowGuessCounter --;
  });

  guessedCardCell.append(guessedCardImage);
  rowGuessCounter ++;
}

function handleSubmit() {
  const currentGuessRow = document.querySelector(
    `#guessedCards${guessCounter}`
  );

  const commonCards = goalCardsArray.filter((id) => {
    return currentGuessArray.includes(id);
  });

  for (let i = 0; i < 5; i++) {
    const currentGuessCell = currentGuessRow.querySelector(`.guess${i}`);

    const resultDiv = document.createElement("div");
    const valueDiv = document.createElement("div");
    const suitDiv = document.createElement("div");
    let suitMatch = false;
    let valueMatch = false;
    let allMatch = false;

    const currentGuessValue = currentGuessArray[i][0];
    const currentGuessSuit = currentGuessArray[i][1];
    const matchInGuessable = document.getElementById(currentGuessArray[i])
    let suitIcon;

    currentGuessCell.classList.add("blocked", "submitted");
    resultDiv.classList.add("results");
    suitDiv.classList.add("suit");
    valueDiv.classList.add("value");

    if (currentGuessValue === "0") {
      valueDiv.textContent = "10";
    } else {
      valueDiv.textContent = currentGuessValue;
    }

    switch (currentGuessSuit) {
      case "H":
        suitIcon = "❤️";
        break;
      case "S":
        suitIcon = "♠️";
        break;
      case "C":
        suitIcon = "♣️";
        break;
      case "D":
        suitIcon = "♦️";
        break;
    }
    suitDiv.textContent = suitIcon;

    if (goalCardsArray.includes(currentGuessArray[i])) {
      allMatch = true;
      suitMatch = true;
      valueMatch = true;
      resultDiv.textContent = "QARD!";
      
      //console.log(matchInGuessable)
      matchInGuessable.classList.add("qard")
      resultDiv.classList.add("allMatch");
      
      if (!contrastMode) {
        resultDiv.classList.add("allMatch");
      } else {
        resultDiv.classList.add("allMatch", "contrast");
      }

    } else {
      //const matchInGuessable = document.getElementById(currentGuessArray[i])
      //console.log(matchInGuessable)
      matchInGuessable.classList.add("eliminated")
      let i = 0;

      while (!valueMatch && i < 5) {
        if (currentGuessValue === goalCardsArray[i][0]) {
          valueMatch = true;
        }
        i++;
      }

      let j = 0;
      while (!suitMatch && j < 5) {
        if (currentGuessSuit === goalCardsArray[j][1]) {
          suitMatch = true;
        }
        j++;
      }
    }

    if (valueMatch) {
      if (!contrastMode) {
        valueDiv.classList.add("correct");
      } else {
        valueDiv.classList.add("correct", "contrast");
      }
    } else {
      if (!contrastMode) {
        valueDiv.classList.add("wrong");
      } else {
        valueDiv.classList.add("wrong", "contrast");
      }
    }

    if (suitMatch) {
      if (!contrastMode) {
        suitDiv.classList.add("correct");
      } else {
        suitDiv.classList.add("correct", "contrast");
      }
    } else {
      if (!contrastMode) {
        suitDiv.classList.add("wrong");
      } else {
        suitDiv.classList.add("wrong", "contrast");
      }
    }

    if (!allMatch) {
      resultDiv.append(valueDiv, suitDiv);
    }
    // if(!suitMatch || !valueMatch){
    //   const matchInGuessable = document.getElementById(currentGuessArray[i])
    //   console.log(matchInGuessable)
    //   matchInGuessable.classList.add("eliminated")
    // }
    currentGuessCell.append(resultDiv);
  }
  if (commonCards.length === 5) {
    losing = false;
    endGame();
  }

  currentGuessArray = ["none", "none", "none", "none", "none"];
  guessCounter++;
  rowGuessCounter = 0;

  
}

function makeHint(){
  let spadeString = ' spades'
  let clubString = " clubs"
  let diamondString = " diamonds"
  let heartString = " hearts"

  let spadeNum = 0
  let clubNum = 0
  let diamondNum = 0
  let heartNum = 0

  goalCardsArray.forEach( (goalCard) => {
    switch (goalCard[1]) {
      case 'S' : spadeNum += 1; 
      break;
      case 'C' : clubNum += 1;
      break;
      case "D": diamondNum += 1;
      break;
      case "H": heartNum += 1;
      break;
    }
  })

  if (spadeNum === 1){ spadeString = " spade"}
  if (clubNum === 1){clubString = " club"}
  if (diamondNum === 1){diamondString = " diamond"}
  if (heartNum === 1){heartString = " heart"}

  //console.log("spades", spadeNum, "clubs ", clubNum, " diamonds ", diamondNum, " hearts ", heartNum)

  const hintArray = [(spadeNum + spadeString), (clubNum + clubString), (diamondNum + diamondString), (heartNum + heartString)]
  const randomIndex = Math.floor(Math.random()*hintArray.length)
  const hint = `This QARDLE has ${hintArray[randomIndex]}.`
  return hint

}

// Game End Function
function endGame() {
  submitBtn.classList.add("hidden");
  giveUpBtn.classList.add("hidden");
  hintBtn.classList.add("hidden")
  availableCardsDiv.classList.add("hidden");
  gameEnd = true;
  appendGoalCards();
  window.scrollTo(0, 0);
  Splitting();

  if (!losing) {
    const winningDiv = document.querySelector("#winningDiv");
    winningDiv.classList.remove("hidden");
  } else {
    const losingDiv = document.querySelector("#losingDiv");
    losingDiv.classList.remove("hidden");
  }
}
const body = document.getElementsByTagName("body");

// Buttons & Event Listeners
function populateButtons() {
  const faqBtn = document.querySelector("#faqBtn");
  faqBtn.addEventListener("click", () => {
    const faqText = document.querySelector("#faqText");
    faqText.classList.toggle("hidden");
  });

  contrastBtn.addEventListener("click", () => {
    const contrastBtn = document.querySelector("#contrastBtn");
    const contrastIcon = document.querySelector("#contrastIcon");
    const faqIcon = document.querySelector("#faqIcon");
    const content = document.querySelector("#content");
    // const allButtons = document.getElementsByTagName("button");

    contrastBtn.classList.toggle("selected");
    contrastIcon.classList.toggle("selected");
    content.classList.toggle("contrast");
    faqBtn.classList.toggle("selected");
    faqIcon.classList.toggle("selected");
    // allButtons.classList.add("selected");

    if (!contrastMode) {
      contrastMode = true;
    } else {
      contrastMode = false;
    }
  });

  const submitBtn = document.querySelector("#submitBtn");
  submitBtn.addEventListener("click", () => {
    window.scrollTo(0, 350);

    if (currentGuessArray.includes("none")) {
      //if any empty strings in array
      alert("You need 5 cards to guess");
    } else {
      handleSubmit();
    }
  });

  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", () => {
    document.location.reload();
  });

  const giveUpBtn = document.querySelector("#giveUpBtn");
  giveUpBtn.addEventListener("click", () => {
    losing = true;
    endGame();
  });

  const hintBtn = document.getElementById("hintBtn");
  hintBtn.addEventListener("click", () => {
    const hintText = document.querySelector("#hintDiv")
    hintText.textContent = makeHint()
    hintText.classList.toggle("hidden")
  })
}
