const BASE_URL = "https://deckofcardsapi.com/api/deck";
const availableCardsDiv = document.getElementById("availableCardsDiv");

let gameObj = {}
let goalCardImagesArray = [];
let goalCardsArray = [];
let hintArray = [];
let currentGuessArray = ["none", "none", "none", "none", "none"];
let guessCounter = 0;
let rowGuessCounter = 0;
let gameEnd = false;
let losing = true;
let contrastMode = false;
let hintClicked = false;
let savedGame = false;

document.addEventListener("DOMContentLoaded", () => {
  const parsedGame = checkIfGameExists()
  console.log("!!parsedGame ", !!parsedGame)
  console.log("savedGame ", savedGame)
  if (!parsedGame){
    getGoalCardDeck();
    // appendGoalCards();
  } else {
    gameObj = parsedGame
    setValuesFromLoadedGame(parsedGame)
  }
  appendGoalCards()
  setAvailableCards();
  createGuessGrid();
  populateButtons();
});

const saveGameToLocalStorage = () => {
  localStorage.setItem("game", JSON.stringify(gameObj))
}


const checkIfGameExists = () => {
  const storedGameString = localStorage.getItem("game")
  const parsedGame = JSON.parse(storedGameString)
  if (!isEmpty(parsedGame)){
    savedGame = true
    return parsedGame
  } else {
  savedGame =  false
  return null
  }
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const setValuesFromLoadedGame = (passedGameObj) => {
  goalCardsArray = passedGameObj.goalCardsArray
  goalCardImagesArray = passedGameObj.goalCardImagesArray
  hintArray = passedGameObj.hintArray
  guessCounter = passedGameObj.guessCounter
}
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
    const tempCard = createDivElement(["guessableCards"])
    const tempImg = createImgElement(element.images.png);

    tempImg.addEventListener("click", (e) => {
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

const chooseGoalCards = async (goalDeckID) => {
  let response = await fetch(`${BASE_URL}/${goalDeckID}/draw/?count=5`);
  let data = await response.json();
  data.cards.forEach((card) => {
    console.log(card.code); //leave in for testing
    const cardFace = document.createElement("img");
    cardFace.src = card.image;

    goalCardsArray.push(card.code);
    goalCardImagesArray.push(card.image);
  });
  gameObj.goalCardsArray = goalCardsArray
  gameObj.goalCardImagesArray = goalCardImagesArray
  createHintArray();
  gameObj.hintArray = hintArray
  gameObj.guessCounter = guessCounter;
  saveGameToLocalStorage()
};

const renderGoalCards = () => {

}

const getGoalCardDeck = async () => {
  let response = await fetch(`${BASE_URL}/new/shuffle/?deck_count=1`);
  let data = await response.json();
  const goalDeckID = data.deck_id;

  chooseGoalCards(goalDeckID);
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

const handleResultStyling = (
  suitDiv,
  currentGuessSuit,
  valueDiv,
  currentGuessValue
  ) => {
    let suitIcon;
    currentGuessValue === "0"
    ? (valueDiv.textContent = "10")
    : (valueDiv.textContent = currentGuessValue);
    
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
      };
      
const testMatch = (testCase, checkIndex, currentGuessCase) => {
  let i = 0;
  while (!testCase && i < 5) {
    if (currentGuessCase === goalCardsArray[i][checkIndex]) {
      testCase = true;
    }
    i++;
  }
  return testCase;
};

let savedGuessesArray = []
const saveGuessAsObj = (cellID, cardCode, cardImg, result) => {
  const tempGuessObj = {}
  savedGuessesArray.push(tempGuessObj)
}

const displayGuesses = (guessObjArray) => {
  

}
const checkIfGameEnd = () => {
  const commonCards = goalCardsArray.filter((id) => {
    return currentGuessArray.includes(id);
  });
  if (commonCards.length === 5) {
    losing = false;
    endGame();
  }

  if (guessCounter === 5) {
    endGame();
  }
}

const cleanUpAfterGuess = () => {
  currentGuessArray = ["none", "none", "none", "none", "none"];
  rowGuessCounter = 0;
}

const evaluateAndRenderCurrentGuess= (currentGuessRow) => {
  for (let i = 0; i < 5; i++) {
    const currentGuessCell = currentGuessRow.querySelector(`.guess${i}`);
    const resultDiv = createDivElement(["results"]);
    const valueDiv = createDivElement(["value"]);
    const suitDiv = createDivElement(["suit"]);
    const currentGuessValue = currentGuessArray[i][0];
    const currentGuessSuit = currentGuessArray[i][1];
    const matchInGuessable = document.getElementById(currentGuessArray[i]);

    let suitMatch = false;
    let valueMatch = false;
    let allMatch = false;

    currentGuessCell.classList.add("blocked", "submitted");
    handleResultStyling(suitDiv, currentGuessSuit, valueDiv, currentGuessValue);

    // determines if currentGuess fully matches anything in goalCards
    if (goalCardsArray.includes(currentGuessArray[i])) {
      allMatch = true;
      resultDiv.textContent = "QARD!";
      matchInGuessable.classList.add("qard");
      resultDiv.classList.add("allMatch");
    } else {
      // determine if currentGuess is partial match
      matchInGuessable.classList.add("eliminated");
      valueMatch = testMatch(valueMatch, 0, currentGuessValue);
      suitMatch = testMatch(suitMatch, 1, currentGuessSuit);
    }

    let testResult;
    valueMatch ? (testResult = "correct") : (testResult = "wrong");
    valueDiv.classList.add(testResult);

    suitMatch ? (testResult = "correct") : (testResult = "wrong");
    suitDiv.classList.add(testResult);

    if (!allMatch) {
      resultDiv.append(valueDiv, suitDiv);
    }
    currentGuessCell.append(resultDiv);
  }
}

function handleSubmit() {
  const currentGuessRow = document.querySelector(
    `#guessedCards${guessCounter}`
    );
  evaluateAndRenderCurrentGuess(currentGuessRow)

  guessCounter++;
  gameObj.guessCounter++

  checkIfGameEnd()
  cleanUpAfterGuess()
  saveGameToLocalStorage();
}


function createHintArray() {
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

  hintArray.push(
    spadeNum + spadeString,
    clubNum + clubString,
    diamondNum + diamondString,
    heartNum + heartString
  );

  return hintArray;
}

function getHint() {
  const remainingHints = hintArray.length;
  const randomIndex = Math.floor(Math.random() * remainingHints);
  let remainingHintsText = ` You have ${remainingHints - 1} hints remaining.`;
  if (remainingHints === 2) {
    remainingHintsText = ` You have 1 hint remaining.`;
  } else if (remainingHints === 1) {
    remainingHintsText = `This is your last hint, good luck!`;
  }
  let hint = `This QARDLE has ${hintArray[randomIndex]}.` + remainingHintsText;
  if (remainingHints === 0) {
    hint = "You have no more hints, sorry, not sorry.";
  }
  hintArray.splice(randomIndex, 1);
  return hint;
}

// Game End Function
function endGame() {
  [submitBtn, giveUpBtn, hintBtn, availableCardsDiv].forEach((element) =>
    element.classList.add("hidden")
  );
  gameEnd = true;
  appendGoalCards();
  window.scrollTo(0, 0);
  Splitting();

  const winningDiv = document.querySelector("#winningDiv");
  const losingDiv = document.querySelector("#losingDiv");

  losing
    ? losingDiv.classList.remove("hidden")
    : winningDiv.classList.remove("hidden");

    gameObj = {}
    saveGameToLocalStorage;
}

// Buttons & Event Listeners
function populateButtons() {
  const faqBtn = document.querySelector("#faqBtn");
  const submitBtn = document.querySelector("#submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const giveUpBtn = document.querySelector("#giveUpBtn");
  const hintBtn = document.getElementById("hintBtn");
  const contrastBtn = document.querySelector("#contrastBtn");

  faqBtn.addEventListener("click", () => {
    const faqText = document.querySelector("#faqText");
    faqText.classList.toggle("hidden");
  });

  contrastBtn.addEventListener("click", () => {
    const content = document.querySelector("#content");
    content.classList.toggle("contrast");

    contrastMode ? !contrastMode : contrastMode;
  });

  submitBtn.addEventListener("click", () => {
    window.scrollTo(0, 350);
    currentGuessArray.includes("none")
      ? alert("You must select 5 cards")
      : handleSubmit();
  });

  resetBtn.addEventListener("click", () => {
    gameObj = {}
    saveGameToLocalStorage();
    document.location.reload();
  });

  giveUpBtn.addEventListener("click", () => {
    losing = true;
    endGame();
  });

  hintBtn.addEventListener("click", () => {
    const hintText = document.querySelector("#hintDiv");

    hintText.classList.toggle("hidden");

    if (!hintClicked) {
      hintText.textContent = getHint();
      hintClicked = true;
    } else {
      hintClicked = false;
    }
  });
}