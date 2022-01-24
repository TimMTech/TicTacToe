const playerOne = 'X';
const playerTwo = 'O';

let playerOneScore = 0;
let playerTwoScore = 0;

const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

const cellElements = document.querySelectorAll('.cell');
const winningDiv = document.querySelector('.winner')
const resetButton = document.querySelector('.reset')
const playerSubmit = document.getElementById('player-info-save')
const playerOneParticipant = document.getElementById('player-one-name')
const playerTwoParticipant = document.getElementById('player-two-name')
const warningMessage = document.getElementById('warning-message')

let circleTurn;

let playerMarkStyle = (cell, color) => {
    const markColor = cell.style;
    markColor.color = `${color}`
}

let getPlayerInfo = () => {
    cellElements.forEach((cell) => {
        cell.removeEventListener('click', handleClick);
    })
    playerSubmit.addEventListener('click', () => {
        playerOneEntry = document.getElementById('player-one').value
        playerTwoEntry = document.getElementById('player-two').value
        playerOneParticipant.textContent = playerOneEntry;
        playerTwoParticipant.textContent = playerTwoEntry;
        checkPlayerInfo()
    })
}

let checkPlayerInfo = () => {
    if (playerOneParticipant.textContent && playerTwoParticipant.textContent) {
        cellElements.forEach((cell) => {
            cell.addEventListener('click', handleClick, { once: true })
            warningMessage.textContent = '';
            document.getElementById('player-one').value = '';
            document.getElementById('player-two').value = '';
        })
    } else {
        warningMessage.textContent = '*Please Fill Both Fields'
    }
}


let handleClick = (e) => {
    const cell = e.target;
    if (circleTurn) {
        cell.textContent = playerTwo;
        cell.classList.add(playerTwo)
        playerMarkStyle(cell, 'blue')
    } else {
        cell.textContent = playerOne;
        cell.classList.add(playerOne)
        playerMarkStyle(cell, 'red')
    }
    if (checkWin(playerOne)) {
        gameDeclaration(false)
    } else if (checkWin(playerTwo)) {
        gameDeclaration(false);
    } else if (drawGame()) {
        gameDeclaration(true)
    } else {
        swapTurns()
    }
}

let drawGame = () => {
    return [...cellElements].every((cell) => {
        return cell.classList.contains(playerOne) ||
            cell.classList.contains(playerTwo);
    })
}

let gameDeclaration = (draw) => {
    if (draw) {
        winningDiv.textContent = 'Draw Game';
    } else {
        winningDiv.textContent = `${circleTurn ? playerTwoParticipant.textContent : playerOneParticipant.textContent} Wins!`
        cellElements.forEach((cell) => {
            cell.style.pointerEvents = 'none'
        })
    }
    winningDiv.classList.add('show')
}


let swapTurns = () => {
    circleTurn = !circleTurn;
}

let checkWin = (player) => {
    return WINNING_COMBINATIONS.some((combination) => {
        return combination.every((index) => {
            return cellElements[index].classList.contains(player)
        })
    })
}

let resetGame = () => {
    circleTurn = false;
    cellElements.forEach((cell) => {
        cell.classList.remove(playerOne)
        cell.classList.remove(playerTwo)
        winningDiv.textContent = ''
        cell.textContent = ''
        cell.addEventListener('click', handleClick, { once: true })
        cell.style.pointerEvents = 'auto'
    })
}



cellElements.forEach((cell) => {
    cell.addEventListener('click', handleClick, { once: true })
})

resetButton.addEventListener('click', resetGame)



getPlayerInfo()














