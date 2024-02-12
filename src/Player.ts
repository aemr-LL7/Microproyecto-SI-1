import { BingoCard } from "./BingoCard.js";
import { Patterns } from "./Patterns.js";

export class Player {
  /*Attributes*/
  private userName: string;
  private score: number;
  private cardboard: BingoCard;

  constructor(userName: string, score: number, cardboard: BingoCard) {
    this.userName = userName;
    this.score = score;
    this.cardboard = cardboard;
  }

  // markDownNumber(num: number): void {
  //   this.cardboard.markNumber(num);
  //   if (this.cardboard.isComplete()) {
  //     // Actualizar puntuación segun reglas del juego
  //     this.setScore(this.getScore() + 5);
  //   }
  // }

  updatePlayerScore(buttonNumber: number): void {
    if (this.cardboard.markNumber(buttonNumber)) {
      // Recorrer los patrones y buscar coincidencias
      for (const pattern of Patterns) {
        const isPatternComplete = this.cardboard.hasPattern(pattern.id);
        if (isPatternComplete) {
          this.score += pattern.points;
          // ... Actualizar la interfaz con la nueva puntuación y el nombre del patrón
        }
      }
    }
  }

  haveWon(): boolean {
    return this.cardboard.isComplete();
  }

  /*Getters setters*/
  getUserName(): string {
    return this.userName;
  }

  getScore(): number {
    return this.score;
  }

  getCardboard(): BingoCard {
    return this.cardboard;
  }

  setUserName(newUserName: string): void {
    this.userName = newUserName;
  }
  setScore(updatedScore: number): void {
    this.score = updatedScore;
  }
}
