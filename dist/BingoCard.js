export class BingoCard {
    constructor(size) {
        this.maxSize = size;
        this.cardMatrix = new Array(size);
        for (let i = 0; i < size; i++) {
            this.cardMatrix[i] = new Array(size);
            for (let j = 0; j < size; j++) {
                this.cardMatrix[i][j] = Math.floor(Math.random() * 50) + 1;
            }
        }
    }
    getMatrixNumbers() {
        return this.cardMatrix;
    }
    markNumber(num) {
        let numberWasMarked = false;
        for (let i = 0; i < this.maxSize; i++) {
            for (let j = 0; j < this.maxSize; j++) {
                if (this.cardMatrix[i][j] === num) {
                    this.cardMatrix[i][j] = -1;
                    numberWasMarked = true;
                    break;
                }
            }
            if (numberWasMarked) {
                break;
            }
        }
        return numberWasMarked;
    }
    checkARow(row) {
        for (let j = 0; j < this.maxSize; j++) {
            if (this.cardMatrix[row][j] !== -1) {
                return false;
            }
        }
        return true;
    }
    checkAColumn(column) {
        for (let i = 0; i < this.maxSize; i++) {
            if (this.cardMatrix[i][column] !== -1) {
                return false;
            }
        }
        return true;
    }
    checkADiagonal() {
        for (let i = 0; i < this.maxSize; i++) {
            if (this.cardMatrix[i][i] !== -1) {
                return false;
            }
        }
        return true;
    }
    isComplete() {
        for (let i = 0; i < this.maxSize; i++) {
            for (let j = 0; j < this.maxSize; j++) {
                if (this.cardMatrix[i][j] !== -1) {
                    return false;
                }
            }
        }
        return true;
    }
    hasPatternEssai(pattern) {
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
        }
        else if (pattern === "vertical") {
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
        }
        else if (pattern === "diagonal") {
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
        }
        else if (pattern === "full") {
            if (this.isComplete()) {
                return this.isComplete();
            }
        }
        return false;
    }
    hasPattern(patternId) {
        switch (patternId) {
            case 1:
                for (let row = 0; row < this.maxSize; row++) {
                    if (this.checkARow(row)) {
                        return true;
                    }
                }
                return false;
            case 2:
                for (let column = 0; column < this.maxSize; column++) {
                    if (this.checkAColumn(column)) {
                        return true;
                    }
                }
                return false;
            case 3:
                return this.checkADiagonal();
            case 4:
                return this.isComplete();
            default:
                throw new Error(`Patrón no válido: ${patternId}`);
        }
    }
    printCard() {
        console.log("┌" + "─".repeat(this.cardMatrix.length * 3) + "┐");
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
