export function showTurn(turnNumber) {
    const turnElement = document.getElementById("turn-count");
    if (turnElement) {
        turnElement.textContent = `TURNO ${turnNumber}`;
    }
}
