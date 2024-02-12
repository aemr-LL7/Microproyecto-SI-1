import { Player } from "./Player.js";
import { BingoCard } from "./BingoCard.js";
import { showTurn } from "./TurnLogic.js";

// Campos de texto
const player1Input = document.getElementById("player1") as HTMLInputElement;
const player2Input = document.getElementById("player2") as HTMLInputElement;
const player3Input = document.getElementById("player3") as HTMLInputElement;
const player4Input = document.getElementById("player4") as HTMLInputElement;
const selectedCardSize = document.getElementById(
  "card-size"
) as HTMLInputElement;

const playersList: Player[] = [];

// Opciones
const submitButton = document.getElementById("submit-btn") as HTMLInputElement;
let gameStarted = false;
let isTurnActive = false;
const overlay = document.getElementById("overlay");
const generatedNumbers: number[] = [];
let currentTurn = 1;

// Funciones

function validateForm() {
  // Validar si todos los campos estan llenos
  const allFieldsFilled =
    player1Input.value !== "" &&
    player2Input.value !== "" &&
    player3Input.value !== "" &&
    player4Input.value !== "";

  // Si todos los campos estan llenos, activar y cambiar el color del botón
  if (allFieldsFilled) {
    submitButton.disabled = false;
    submitButton.classList.add("button-active");
  } else {
    submitButton.disabled = true;
    submitButton.classList.remove("button-active");
  }
}

function startGame() {
  let countdownStarted = false;

  if (!gameStarted) {
    const generalCardSize = parseInt(selectedCardSize.value);

    for (let i = 1; i <= 4; i++) {
      const playerName =
        (
          document.getElementById(`player${i}`) as HTMLInputElement
        )?.value?.trim() || "";
      const capitalizedName =
        playerName.charAt(0).toUpperCase() + playerName.slice(1).toLowerCase();

      if (capitalizedName) {
        // Crear el jugador
        const bingoCard = new BingoCard(generalCardSize);
        const player = new Player(capitalizedName, 0, bingoCard);
        playersList.push(player);
      } else {
        console.error(
          `El nombre del jugador 'player${i}' no puede estar vacío.`
        );
      }
    }

    // Desactiva el boton y la seccion agregar mas jugadores
    const newGameForm = document.getElementById("new-game-form");
    if (newGameForm) {
      newGameForm.classList.add("hidden");
    } else {
      console.error("Element 'new-game' no encontrado");
    }

    // Recorrer la lista y crear las tablas de bingo para cada jugador
    playersList.forEach((player) => {
      // Crear un div para la tabla del jugador
      const playerDiv = document.createElement("div");

      // Añadir nombre del jugador
      const playerName = document.createElement("h2");
      playerName.textContent = player.getUserName();
      playerDiv.appendChild(playerName);

      // Crear la tabla de bingo
      const bingoTable = document.createElement("table");

      // Generar y mostrar los numeros como botones
      for (
        let i = 0;
        i < player.getCardboard().getMatrixNumbers().length;
        i++
      ) {
        // Tabla fila
        const row = document.createElement("tr");
        for (
          let j = 0;
          j < player.getCardboard().getMatrixNumbers()[i].length;
          j++
        ) {
          // Tabla celda
          const cell = document.createElement("td");

          const button = document.createElement("button");
          button.id = `${i + 1}-${j + 1}`;
          button.classList.add("number-button");
          button.textContent = player
            .getCardboard()
            .getMatrixNumbers()
            [i][j].toString();
          //button.onclick = selectNumber.bind(button);

          cell.appendChild(button);
          row.appendChild(cell);

          button.addEventListener("click", function () {
            // Cambiar el color del boton??
            button.classList.add("selected");
          });
        }
        bingoTable.appendChild(row);
      }

      // Añadir la tabla al div del jugador
      playerDiv.appendChild(bingoTable);

      // Añadir el div del jugador al elemento players-board
      const gameBoardElement = document.getElementById("players-board");
      if (gameBoardElement) {
        gameBoardElement.appendChild(playerDiv);
      }
    });

    // Iniciar contador
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
    } else {
      console.error("Elemento 'countdown-text' no encontrado");
    }

    if (counter === 0) {
      clearInterval(interval);
      hideOverlay();
      // Iniciar la partida

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

function showNumber(randomNumber: number) {
  const ballNumberElement = document.getElementById("ball-number");
  if (ballNumberElement) {
    ballNumberElement.textContent = randomNumber.toString();
  } else {
    console.error("Elemento 'ball-number' no encontrado");
  }
}

function playGame() {
  if (gameStarted) {
    for (let i = 0; i < 25; i++) {
      // Generar y mostrar número
      const randomNumber = generateRandomNumber();
      showNumber(randomNumber);

      // Seleccionar el boton si coincide
      const buttons = document.getElementsByClassName("number-button");

      for (let j = 0; j < buttons.length; j++) {
        const buttonNumber = Number(buttons[j].textContent);
        if (buttonNumber === randomNumber) {
          buttons[j].classList.add("selected");

          // Actualizar la puntuación del jugador
          const player = playersList.find((p) => {
            const flatMatrixNumbers = p
              .getCardboard()
              .getMatrixNumbers()
              .flat();
            return flatMatrixNumbers.includes(buttonNumber);
          });

          if (player) {
            player.updatePlayerScore(buttonNumber);
            // Actualizar la interfaz
            const playerScoreElement = document.getElementById("player-score");
            if (playerScoreElement) {
              playerScoreElement.textContent = player.getScore().toString();
            }
          }
        }
      }
    }
  }
  // Restablecer el color del botón
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
  // obtener los jugadores con la mayor puntuacion en la partida
}

function updateGameScore(player: Player, newScore: number) {
  player.setScore(newScore);

  // Actualizar el contenido del h3
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

  // Actualizar el numero de turno
  currentTurn++;

  if (currentTurn > 25) {
    endGame();
  } else {
    // Iniciar el siguiente turno
    startTurn();
  }
  //updateTurn(currentTurn);
}

function initGame() {
  currentTurn = 1;
  startTurn();
}

function endGame() {
}

function resetGame(){}

function updatePlayerStats(playerName: string, score: number, wins: number) {
  const playerData = localStorage.getItem(playerName);

  // Si el jugador no existe en Local Storage, crearlo
  if (!playerData) {
    localStorage.setItem(playerName, JSON.stringify({
      name: playerName,
      score: score,
      wins: wins,
    }));
  } else {
    // Actualizar jugador
    const playerObject = JSON.parse(playerData);
    playerObject.score += score;
    playerObject.wins += wins;

    // Almacenar el objeto actualizado en Local Storage
    localStorage.setItem(playerName, JSON.stringify(playerObject));
  }
}

// Evento para aplicar los cambios
function attachEvents() {
  const playerInputs = [player1Input, player2Input, player3Input, player4Input];

  playerInputs.forEach((input) => {
    input.addEventListener("change", validateForm);
  });

  submitButton.addEventListener("click", startGame);
}

// Estado inicial del boton
validateForm();
// Agregar los eventos a los elementos del formulario
attachEvents();

// Agregar evento
submitButton.addEventListener("click", (event) => {
  event.preventDefault();
});
