import { Patterns } from "./Patterns.js";
export class Player {
    constructor(userName, score, cardboard) {
        this.userName = userName;
        this.score = score;
        this.cardboard = cardboard;
    }
    updatePlayerScore(buttonNumber) {
        if (this.cardboard.markNumber(buttonNumber)) {
            for (const pattern of Patterns) {
                const isPatternComplete = this.cardboard.hasPattern(pattern.id);
                if (isPatternComplete) {
                    this.score += pattern.points;
                }
            }
        }
    }
    haveWon() {
        return this.cardboard.isComplete();
    }
    getUserName() {
        return this.userName;
    }
    getScore() {
        return this.score;
    }
    getCardboard() {
        return this.cardboard;
    }
    setUserName(newUserName) {
        this.userName = newUserName;
    }
    setScore(updatedScore) {
        this.score = updatedScore;
    }
}
