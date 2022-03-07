const goalCardsArray = [];
let currentGuessArray = [];
let deckID; 

let guessCounter = 0;

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://deckofcardsapi.com/api/deck/new/")
    .then((response) => response.json())
    .then((data) => {
        deckID = data.deck_id
        fetch(`https://deckofcardsapi.com/api/deck/${deckID}/draw/?count=13`)
        .then((response) => response.json())
        .then(data => {
          console.log(data.cards)
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
    const guessedCardImage = document.createElement("img")
    guessedCardImage.src = e.target.src
    //guessedCardImage.id = `guess`
    const guessedCardSpace = document.getElementById("allGuessedCardsDiv")
    guessedCardSpace.appendChild(guessedCardImage)
  }