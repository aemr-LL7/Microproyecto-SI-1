import { Player } from "./Player.js";
import { BingoCard } from "./BingoCard.js";
import { showTurn } from "./TurnLogic.js";
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const player3Input = document.getElementById("player3");
const player4Input = document.getElementById("player4");
const selectedCardSize = document.getElementById("card-size");
const playersList = [];
const submitButton = document.getElementById("submit-btn");
let gameStarted = false;
let isTurnActive = false;
const overlay = document.getElementById("overlay");
const generatedNumbers = [];
let currentTurn = 1;
function validateForm() {
    const allFieldsFilled = player1Input.value !== "" &&
        player2Input.value !== "" &&
        player3Input.value !== "" &&
        player4Input.value !== "";
    if (allFieldsFilled) {
        submitButton.disabled = false;
        submitButton.classList.add("button-active");
    }
    else {
        submitButton.disabled = true;
        submitButton.classList.remove("button-active");
    }
}
function startGame() {
    var _a, _b;
    let countdownStarted = false;
    if (!gameStarted) {
        const generalCardSize = parseInt(selectedCardSize.value);
        for (let i = 1; i <= 4; i++) {
            const playerName = ((_b = (_a = document.getElementById(`player${i}`)) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.trim()) || "";
            const capitalizedName = playerName.charAt(0).toUpperCase() + playerName.slice(1).toLowerCase();
            if (capitalizedName) {
                const bingoCard = new BingoCard(generalCardSize);
                const player = new Player(capitalizedName, 0, bingoCard);
                playersList.push(player);
            }
            else {
                console.error(`El nombre del jugador 'player${i}' no puede estar vacío.`);
            }
        }
        const newGameForm = document.getElementById("new-game-form");
        if (newGameForm) {
            newGameForm.classList.add("hidden");
        }
        else {
            console.error("Element 'new-game' no encontrado");
        }
        playersList.forEach((player) => {
            const playerDiv = document.createElement("div");
            const playerName = document.createElement("h2");
            playerName.textContent = player.getUserName();
            playerDiv.appendChild(playerName);
            const bingoTable = document.createElement("table");
            for (let i = 0; i < player.getCardboard().getMatrixNumbers().length; i++) {
                const row = document.createElement("tr");
                for (let j = 0; j < player.getCardboard().getMatrixNumbers()[i].length; j++) {
                    const cell = document.createElement("td");
                    const button = document.createElement("button");
                    button.id = `${i + 1}-${j + 1}`;
                    button.classList.add("number-button");
                    button.textContent = player
                        .getCardboard()
                        .getMatrixNumbers()[i][j].toString();
                    cell.appendChild(button);
                    row.appendChild(cell);
                    button.addEventListener("click", function () {
                        button.classList.add("selected");
                    });
                }
                bingoTable.appendChild(row);
            }
            playerDiv.appendChild(bingoTable);
            const gameBoardElement = document.getElementById("players-board");
            if (gameBoardElement) {
                gameBoardElement.appendChild(playerDiv);
            }
        });
        if (!countdownStarted) {
            startCountdown();
            countdownStarted = true;
        }
        gameStarted = true;
        startTurn();
        playGame();
    }
}
function showOverlay() {
    if (overlay) {
        overlay.style.display = "block";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
    }
}
function hideOverlay() {
    if (overlay) {
        overlay.style.display = "none";
    }
}
function startCountdown() {
    showOverlay();
    let counter = 3;
    const interval = setInterval(() => {
        counter--;
        const countdownTextElement = document.getElementById("countdown-text");
        if (countdownTextElement) {
            countdownTextElement.textContent = counter.toString();
        }
        else {
            console.error("Elemento 'countdown-text' no encontrado");
        }
        if (counter === 0) {
            clearInterval(interval);
            hideOverlay();
            const countdownTextElement = document.getElementById("countdown-text");
            if (countdownTextElement) {
                countdownTextElement.textContent = "";
            }
        }
    }, 1150);
}
function generateRandomNumber() {
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 50) + 1;
    } while (generatedNumbers.includes(randomNumber));
    generatedNumbers.push(randomNumber);
    return randomNumber;
}
function showNumber(randomNumber) {
    const ballNumberElement = document.getElementById("ball-number");
    if (ballNumberElement) {
        ballNumberElement.textContent = randomNumber.toString();
    }
    else {
        console.error("Elemento 'ball-number' no encontrado");
    }
}
function playGame() {
    if (gameStarted) {
        for (let i = 0; i < 25; i++) {
            const randomNumber = generateRandomNumber();
            showNumber(randomNumber);
            const buttons = document.getElementsByClassName("number-button");
            for (let j = 0; j < buttons.length; j++) {
                const buttonNumber = Number(buttons[j].textContent);
                if (buttonNumber === randomNumber) {
                    buttons[j].classList.add("selected");
                    const player = playersList.find((p) => {
                        const flatMatrixNumbers = p
                            .getCardboard()
                            .getMatrixNumbers()
                            .flat();
                        return flatMatrixNumbers.includes(buttonNumber);
                    });
                    if (player) {
                        player.updatePlayerScore(buttonNumber);
                        const playerScoreElement = document.getElementById("player-score");
                        if (playerScoreElement) {
                            playerScoreElement.textContent = player.getScore().toString();
                        }
                    }
                }
            }
        }
    }
    const buttons = document.getElementsByClassName("number-button");
    for (let button of buttons) {
        button.addEventListener("click", () => {
            if (button.classList.contains("selected")) {
                button.classList.remove("selected");
            }
        });
    }
}
function getWinners() {
}
function updateGameScore(player, newScore) {
    player.setScore(newScore);
    const playerScoreElement = document.getElementById("player-score");
    if (playerScoreElement) {
        playerScoreElement.innerHTML = "";
        playersList.forEach((player) => {
            const playerScoreText = `${player.getUserName()}: ${player.getScore()}`;
            playerScoreElement.innerHTML += `<li>${playerScoreText}</li>`;
        });
    }
}
function startTurn() {
    isTurnActive = true;
    showTurn(currentTurn);
}
function endTurn() {
    isTurnActive = false;
    currentTurn++;
    if (currentTurn > 25) {
        endGame();
    }
    else {
        startTurn();
    }
}
function initGame() {
    currentTurn = 1;
    startTurn();
}
function endGame() {
}
function attachEvents() {
    const playerInputs = [player1Input, player2Input, player3Input, player4Input];
    playerInputs.forEach((input) => {
        input.addEventListener("change", validateForm);
    });
    submitButton.addEventListener("click", startGame);
}
validateForm();
attachEvents();
submitButton.addEventListener("click", (event) => {
    event.preventDefault();
});
