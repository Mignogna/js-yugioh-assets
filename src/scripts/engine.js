const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites: {
        avatar: document.getElementById("card_image"),
        name: document.getElementById("card_name"),
        type: document.getElementById("card_type"),
    },
    fieldCards: {
        player: document.getElementById("player_field_card"),
        computer: document.getElementById("computer_field_card"),
    }, actions: {
        button: document.getElementById("next_duel")
    },
    playerSides: {
        player1: "player_cards",
        playerBox1: document.getElementById("player_cards"),
        computer: "computer_cards",
        computerBox: document.getElementById("computer_cards")
    },
};

const playerSides = {
    player1: "player_cards",
    computer: "computer_cards",
}

const pathImages = "./src/assets/icons/"

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "75px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data_id", idCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectedCard(idCard)
        })
        cardImage.addEventListener("click", () => {
            setCardField(cardImage.getAttribute("data_id"))
        })
    }
    return cardImage;
}

async function setCardField(cardId) {
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();
    await showHiddenCardFieldsImages(true);
    await hiddenCardDetails();
    await drawCardsInField(cardId, computerCardId)
    let duelResults = await checkDuelResults(cardId, computerCardId);
    await updateScore();
    await drawButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function showHiddenCardFieldsImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }if(value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}
async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win:${state.score.playerScore} | Lose:${state.score.computerScore}`
    state.score.scoreBox.style.fontSize = "14px"

}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "DRAW";
    let playerCard = cardData[playerCardId];
    if (playerCard.WinOf.includes(computerCardId)) {
        duelResults = "WIN";
        state.score.playerScore++;
    }
    if (playerCard.LoseOf.includes(computerCardId)) {
        state.score.computerScore++;
        duelResults = "LOSE";
    }
    await playAudio(duelResults);
    return duelResults;
}

async function removeAllCardsImages() {
    let { computerBox, playerBox1 } = state.playerSides
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = playerBox1.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.avatar.style.height = "180px"
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute:" + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const CardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(CardImage)
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try {
        audio.play();
    } catch { };
}
function init() {
    showHiddenCardFieldsImages(false);
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
    const bgm = document.getElementById("bgm");
    bgm.play();
}
init()