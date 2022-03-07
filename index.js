const goalCardsArray = ['AS', "2S", "3S", "4S", "5S"];
let currentGuessArray = [];
let deckID; 

let guessCounter = 1;

const submitBtn = document.querySelector("#submitBtn")
submitBtn.addEventListener("click", (e) => handleSubmit(e))

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
            tempImg.addEventListener("click", e => addGuess(e))
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
    currentGuessArray.push(e.target.id)
    //console.log(currentGuessArray)
    
    //guessedCardImage.addEventListener("click", (e) => {e.target.remove()})
    //guessedCardImage.id = `guess`
    const guessedCardSpace = document.getElementById(`guessedCards${guessCounter}`)
    //console.log(`guessedCards${guessCounter}`)
    guessedCardDiv.append(guessedCardImage)
    guessedCardSpace.appendChild(guessedCardDiv)
    //figure out how to stop taking guesses after 5
    //if top id == bottom id (ie AD, 2D), then toggle mouseclick/pointer event
  }

function handleSubmit(e){
  const commonCards = goalCardsArray.filter((id) => {
    return currentGuessArray.includes(id)
  })
  // console.log("current guess", currentGuessArray)
  // console.log("goal", goalCardsArray)
  // console.log("common cards ", commonCards)
  if (commonCards.length === 5){
    alert("YOU WON!!!")
  }
}