import { Player } from "./Player.js";
import { Patterns } from "./Patterns.js";

export class BingoCard {
  /*Attributes*/
  private cardMatrix: number[][];
  private maxSize: number;

  /*Inicializar la matriz vacia nxn*/
  constructor(size: number) {
    this.maxSize = size;
    this.cardMatrix = new Array(size);

    for (let i = 0; i < size; i++) {
      this.cardMatrix[i] = new Array(size);
      for (let j = 0; j < size; j++) {
        // Genera un número aleatorio entre 1 y 75 (por ejemplo)
        this.cardMatrix[i][j] = Math.floor(Math.random() * 50) + 1;
      }
    }
  }

  getMatrixNumbers(): number[][] {
    return this.cardMatrix;
  }

  markNumber(num: number): boolean {
    let numberWasMarked = false;

    for (let i = 0; i < this.maxSize; i++) {
      for (let j = 0; j < this.maxSize; j++) {
        if (this.cardMatrix[i][j] === num) {
          this.cardMatrix[i][j] = -1; // Marcar como "visitado"
          numberWasMarked = true;
          break; // Salir del bucle interno si encontro el numero
        }
      }
      if (numberWasMarked) {
        break;
      }
    }

    return numberWasMarked;
  }

  checkARow(row: number): boolean {
    for (let j = 0; j < this.maxSize; j++) {
      if (this.cardMatrix[row][j] !== -1) {
        return false;
      }
    }
    return true;
  }

  checkAColumn(column: number): boolean {
    for (let i = 0; i < this.maxSize; i++) {
      if (this.cardMatrix[i][column] !== -1) {
        return false;
      }
    }
    return true;
  }

  checkADiagonal(): boolean {
    for (let i = 0; i < this.maxSize; i++) {
      if (this.cardMatrix[i][i] !== -1) {
        return false;
      }
    }
    return true;
  }

  isComplete(): boolean {
    for (let i = 0; i < this.maxSize; i++) {
      for (let j = 0; j < this.maxSize; j++) {
        if (this.cardMatrix[i][j] !== -1) {
          return false;
        }
      }
    }
    return true;
  }

  hasPatternEssai(pattern: string): boolean {
    if (pattern === "horizontal") {
      for (let i = 0; i < this.maxSize; i++) {
        let isRowComplete = true;
        for (let j = 0; j < this.maxSize; j++) {
          if (this.cardMatrix[i][j] !== -1) {
            isRowComplete = false;
            break;
          }
        }
        if (isRowComplete) {
          return isRowComplete;
        }
      }
    } else if (pattern === "vertical") {
      for (let j = 0; j < this.maxSize; j++) {
        let isColumnComplete = true;
        for (let i = 0; i < this.maxSize; i++) {
          if (this.cardMatrix[i][j] !== -1) {
            isColumnComplete = false;
            break;
          }
        }
        if (isColumnComplete) {
          return isColumnComplete;
        }
      }
    } else if (pattern === "diagonal") {
      let isMainDiagComplete = true;
      let isSecondaryDiagComplete = true;

      for (let i = 0; i < this.maxSize; i++) {
        if (this.cardMatrix[i][i] !== -1) {
          isMainDiagComplete = false;
        }
        if (this.cardMatrix[i][this.maxSize - 1 - i] !== -1) {
          isSecondaryDiagComplete = false;
        }
      }
      if (isMainDiagComplete || isSecondaryDiagComplete) {
        return isMainDiagComplete || isSecondaryDiagComplete;
      }
    } else if (pattern === "full") {
      if (this.isComplete()) {
        return this.isComplete();
      }
    }
    return false;
  }

  hasPattern(patternId: number): boolean {
    switch (patternId) {
      case 1: // Horizontal
        for (let row = 0; row < this.maxSize; row++) {
          if (this.checkARow(row)) {
            return true;
          }
        }
        return false;

      case 2: // Vertical
        for (let column = 0; column < this.maxSize; column++) {
          if (this.checkAColumn(column)) {
            return true;
          }
        }
        return false;

      case 3: // Diagonal
        return this.checkADiagonal();

      case 4: // Cartón lleno
        return this.isComplete();

      default:
        throw new Error(`Patrón no válido: ${patternId}`);
    }
  }

  printCard(): void {
    console.log("┌" + "─".repeat(this.cardMatrix.length * 3) + "┐");

    // Imprime cada fila con separadores
    for (let i = 0; i < this.cardMatrix.length; i++) {
      let row = "│ ";
      for (let j = 0; j < this.cardMatrix[i].length; j++) {
        row += this.cardMatrix[i][j] + " │ ";
      }
      console.log(row);
    }

    console.log("└" + "─".repeat(this.cardMatrix.length * 3) + "┘");
  }
}
