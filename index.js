const goalCardsArray = ['AS', "2S", "3S", "4S", "5S"];
let currentGuessArray = [];
let deckID; 

let guessCounter = 1;

const submitBtn = document.querySelector("#submitBtn")
submitBtn.addEventListener("click", (e) => {
    //handle/alert if guess array length is < 5
    //after 5th sumbission don't take more guesses
  handleSubmit(e)
})

const resetBtn = document.getElementById("resetBtn")
resetBtn.addEventListener("click", () => {
  document.location.reload();
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://deckofcardsapi.com/api/deck/new/")
    .then((response) => response.json())
    .then((data) => {
        deckID = data.deck_id
        fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=13`)
        .then((response) => response.json())
        .then(data => {
          //console.log(data.cards)
          data.cards.forEach(element => {
            //console.log(element)
            const tempCard = document.createElement('div')
            tempCard.className = "guessableCards"

            const tempImg = document.createElement('img')
            tempImg.src = element.images.png
            tempImg.addEventListener("click", e => {
              if (currentGuessArray.length <= 4) {addGuess(e)}
            })
            tempImg.id = element.code
            //console.log(tempImg.id)
            const cardPlace = document.getElementById('availableCardsDiv')
            tempCard.append(tempImg)
            cardPlace.appendChild(tempCard)
            
          });
        })
      }
    )
  })

  function addGuess(e){
    //console.log(e.target.id)

    const guessedCardDiv = document.createElement("div")
    const guessedCardImage = document.createElement("img")
    guessedCardImage.src = e.target.src
    const currentID = e.target.id
    currentGuessArray.push(currentID)
    guessedCardDiv.classList.add(`guess${currentID}`)
    //console.log(currentGuessArray)
    
    guessedCardImage.addEventListener("click", (e) => {
      const indexToRemove = currentGuessArray.indexOf(currentID)
      currentGuessArray.splice(indexToRemove, 1)
      //console.log(indexToRemove)
      e.target.parentNode.remove()
    })
    //guessedCardImage.id = `guess`
    const guessedCardSpace = document.getElementById(`guessedCards${guessCounter}`)
    //console.log(`guessedCards${guessCounter}`)
    guessedCardDiv.append(guessedCardImage)
    guessedCardSpace.appendChild(guessedCardDiv)
    //figure out how to stop taking guesses after 5
    //if top id == bottom id (ie AD, 2D), then toggle mouseclick/pointer event
  }

function handleSubmit(e){
  const currentGuessDiv = document.querySelector(`#guessedCards${guessCounter}`)
  const commonCards = goalCardsArray.filter((id) => {
    return currentGuessArray.includes(id)
  })
  // console.log("current guess", currentGuessArray)
  // console.log("goal", goalCardsArray)
  // console.log("common cards ", commonCards)
  if (commonCards.length === 5){
    alert("YOU WON!!!")
  } else {
    currentGuessArray.forEach(guess => {
      const resultText = document.createElement('p')
      const thisGuessDiv = currentGuessDiv.querySelector(`.guess${guess}`)
      if (goalCardsArray.includes(guess)){
        //console.log(guess, " in")
        resultText.textContent = "IN"
        //thisGuessDiv.append(resultText)
      } else {
        //console.log(guess, " not in")
        resultText.textContent = "NOT IN"
      }
      thisGuessDiv.appendChild(resultText)
    })
  }
  currentGuessArray = []
  guessCounter ++;
}