const BASE_URL = "https://deckofcardsapi.com/api/deck";
const goalCardsArray = [];
const goalCardImagesArray = [];
const availableCardsDiv = document.getElementById("availableCardsDiv");

let currentGuessArray = ["none", "none", "none", "none", "none"];
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

const createDivElement = (classNameArr, id) => {
  let div = document.createElement("div");
  id ? (div.id = id) : null;

  classNameArr.forEach((className) => div.classList.add(className));
  return div;
};

const createImgElement = (src, className) => {
  let img = document.createElement("img");
  img.src = src;
  className ? (img.className = className) : null;

  return img;
};

const getFullDeck = async (deckID) => {
  let response = await fetch(`${BASE_URL}/${deckID}/draw/?count=52`);
  let data = await response.json();
  data.cards.forEach((element) => {
    const tempCard = document.createElement("div");
    tempCard.className = "guessableCards";

    const tempImg = createImgElement(element.images.png);

    tempImg.addEventListener("click", (e) => {
      console.log(e.target);
      if (currentGuessArray.includes("none")) {
        if (!currentGuessArray.includes(element.code)) {
          addGuess(e);
        }
      }
    });
    tempImg.id = element.code;
    tempCard.append(tempImg);
    availableCardsDiv.appendChild(tempCard);
  });
};

const setAvailableCards = async () => {
  let response = await fetch(`${BASE_URL}/new/`);
  let data = await response.json();
  const deckID = data.deck_id;

  getFullDeck(deckID);
};

const renderCardFace = async (goalDeckID) => {
  let response = await fetch(`${BASE_URL}/${goalDeckID}/draw/?count=5`);
  let data = await response.json();
  data.cards.forEach((card) => {
    console.log(card.code); //leave in for testing
    const cardFace = document.createElement("img");
    cardFace.src = card.image;

    goalCardsArray.push(card.code);
    goalCardImagesArray.push(card.image);
  });
};

const setGoalCards = async () => {
  let response = await fetch(`${BASE_URL}/new/shuffle/?deck_count=1`);
  let data = await response.json();
  const goalDeckID = data.deck_id;

  renderCardFace(goalDeckID);
};

function appendGoalCards() {
  for (let i = 0; i < 5; i++) {
    // const cardImg = createImgElement("", "cardBack"); **** ?

    const cardImg = document.createElement("img");
    cardImg.classList.add("cardBack");
    let thisGoal = document.querySelector(`#goal${i}`);

    if (!gameEnd) {
      cardImg.src = "assets/card.png";
      thisGoal.append(cardImg);
    } else {
      cardImg.src = goalCardImagesArray[i];
      thisGoal.replaceChildren(cardImg);
      cardImg.style = "animation-delay: " + i * 0.2 + "s";

      if (losing) {
        cardImg.classList.add("losing");
      } else if (!losing) {
        cardImg.classList.add("winning");
      }
    }
  }
}

function createGuessGrid() {
  const allGuessedCardsDiv = document.getElementById("allGuessedCardsDiv");

  for (let i = 0; i < 5; i++) {
    const row = createDivElement(["guessed"], `guessedCards${i}`);

    for (let j = 0; j < 5; j++) {
      const cell = createDivElement(["guessBox", `guess${j}`], `cell${i}${j}`);
      row.appendChild(cell);
    }
    allGuessedCardsDiv.append(row);
  }
}

const removeGuessCard = (e, currentID) => {
  const removedBox = e.target.parentNode;
  removedBox.classList.remove("guessedCard", `guess${currentID}`);
  const indexToRemove = currentGuessArray.indexOf(currentID);
  currentGuessArray[indexToRemove] = "none";
  e.target.remove();
  rowGuessCounter--;
};

function addGuess(e) {
  const guessedCardRow = document.querySelector(`#guessedCards${guessCounter}`);
  let guessedCardCell = guessedCardRow.querySelector(
    `#cell${guessCounter}${rowGuessCounter}`
  );

  while (guessedCardCell.classList.value.includes("guessedCard")) {
    guessedCardCell = guessedCardCell.previousSibling;
  }
  const inputCellNum = guessedCardCell.id[5];
  const guessedCardImage = createImgElement(e.target.src);
  const currentID = e.target.id;
  currentGuessArray[inputCellNum] = currentID;

  guessedCardCell.classList.add(`guess${currentID}`, `guessedCard`);

  //REMOVES CARD FROM DOM & GUESS ARRAY WHEN CLICKED
  guessedCardImage.addEventListener("click", (e) =>
    removeGuessCard(e, currentID)
  );

  guessedCardCell.append(guessedCardImage);
  rowGuessCounter++;
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
    const matchInGuessable = document.getElementById(currentGuessArray[i]);
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

      matchInGuessable.classList.add("qard");
      resultDiv.classList.add("allMatch");

      if (!contrastMode) {
        resultDiv.classList.add("allMatch");
      } else {
        resultDiv.classList.add("allMatch", "contrast");
      }
    } else {
      matchInGuessable.classList.add("eliminated");
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

    currentGuessCell.append(resultDiv);
  }
  if (commonCards.length === 5) {
    losing = false;
    endGame();
  }
  guessCounter++;

  if (guessCounter === 5) {
    endGame();
  }

  currentGuessArray = ["none", "none", "none", "none", "none"];
  rowGuessCounter = 0;
}

function makeHint() {
  let spadeString = " spades";
  let clubString = " clubs";
  let diamondString = " diamonds";
  let heartString = " hearts";

  let spadeNum = 0;
  let clubNum = 0;
  let diamondNum = 0;
  let heartNum = 0;

  goalCardsArray.forEach((goalCard) => {
    switch (goalCard[1]) {
      case "S":
        spadeNum += 1;
        break;
      case "C":
        clubNum += 1;
        break;
      case "D":
        diamondNum += 1;
        break;
      case "H":
        heartNum += 1;
        break;
    }
  });

  if (spadeNum === 1) {
    spadeString = " spade";
  }
  if (clubNum === 1) {
    clubString = " club";
  }
  if (diamondNum === 1) {
    diamondString = " diamond";
  }
  if (heartNum === 1) {
    heartString = " heart";
  }

  //console.log("spades", spadeNum, "clubs ", clubNum, " diamonds ", diamondNum, " hearts ", heartNum)

  const hintArray = [
    spadeNum + spadeString,
    clubNum + clubString,
    diamondNum + diamondString,
    heartNum + heartString,
  ];
  const randomIndex = Math.floor(Math.random() * hintArray.length);
  const hint = `This QARDLE has ${hintArray[randomIndex]}.`;
  return hint;
}

// Game End Function
function endGame() {
  submitBtn.classList.add("hidden");
  giveUpBtn.classList.add("hidden");
  hintBtn.classList.add("hidden");
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
    submitBtn.classList.toggle("selected");
    resetBtn.classList.toggle("selected");
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
    const hintText = document.querySelector("#hintDiv");
    hintText.textContent = makeHint();
    hintText.classList.toggle("hidden");
  });
}
