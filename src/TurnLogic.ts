// Función para mostrar el num de turno actual
export function showTurn(turnNumber: number) {
    const turnElement = document.getElementById("turn-count");
  
    // Actualizar el contenido del elemento con el número de turno
    if (turnElement) {
      turnElement.textContent = `TURNO ${turnNumber}`;
    }
  }

  export function updateTurn(){}
  
  