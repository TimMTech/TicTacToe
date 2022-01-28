const playerOne = 'X';
const playerTwo = 'O';
let mode = false;

let playerOneScore = 0;
let playerTwoScore = 0;
let computerScore = 0;

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
const toggleAi = document.getElementById('toggle-ai')
const playerOneParticipant = document.getElementById('player-one-name')
const playerTwoParticipant = document.getElementById('player-two-name')
const warningMessage = document.getElementById('warning-message')
const reachedFive = document.querySelector('.reached-five')

const gridArray = Array.from(cellElements);
let circleTurn;
let tracking = [1, 2, 3, 4, 5, 6, 7, 8, 9];


let playerMarkStyle = (cell, color) => {
    const markColor = cell.style;
    markColor.color = `${color}`
}

let getPlayerInfo = () => {
    cellElements.forEach((cell) => {
        cell.removeEventListener('click', handleClick);
    })
    playerSubmit.addEventListener('click', updateEntries)
}


let updateEntries = () => {
    playerOneEntry = document.getElementById('player-one').value
    playerTwoEntry = document.getElementById('player-two').value
    playerOneParticipant.textContent = playerOneEntry;
    playerTwoParticipant.textContent = playerTwoEntry;
    checkPlayerInfo()
}

let checkPlayerInfo = () => {
    if (playerOneParticipant.textContent && playerTwoParticipant.textContent) {
        cellElements.forEach((cell) => {
            cell.addEventListener('click', handleClick, { once: true })
            warningMessage.textContent = '';
            document.getElementById('player-one').value = '';
            document.getElementById('player-two').value = '';
            playerSubmit.style.pointerEvents = 'none'
            toggleAi.style.pointerEvents = 'none'
        })
    } else {
        warningMessage.textContent = '*Please Fill In Fields'
    }
}

// PLAYER VS PLAYER IMPLEMENTATION

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
        gameDeclaration(false);
        playerOneScore++
        scoreBoard()
    } else if (checkWin(playerTwo)) {
        gameDeclaration(false);
        playerTwoScore++
        scoreBoard()
    } else if (drawGame()) {
        gameDeclaration(true)
    } else {
        swapTurns()
    }
}

let drawGame = () => {
    return [...cellElements].every((cell) => {
        return cell.classList.contains(playerOne) ||
            cell.classList.contains(playerTwo)
    })
}

let gameDeclaration = (draw) => {
    if (draw) {
        winningDiv.textContent = 'Draw Game';
    } else {
        winningDiv.textContent = `${circleTurn ? playerTwoParticipant.textContent : playerOneParticipant.textContent} Wins Round!`
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
    reachedFive.textContent = ''
    cell.textContent = ''
    cell.addEventListener('click', handleClick, { once: true })
    cell.style.pointerEvents = 'auto'
    })
}


let scoreBoard = () => {
    let scoreOne = document.getElementById('player-score-one');
    scoreOne.textContent = playerOneScore;
    let scoreTwo = document.getElementById('player-score-two');
    scoreTwo.textContent = playerTwoScore;
    roundReset(scoreOne, scoreTwo)
}

let roundReset = (scoreOne, scoreTwo) => {
    if (playerOneScore == 5) {
        scoreOne.textContent = '0'
        scoreTwo.textContent = '0'
        winningDiv.textContent = ''
        reachedFive.textContent = `${playerOneParticipant.textContent} WON THE GAME!!`
        playerOneScore = 0
    } else if (playerTwoScore == 5) {
        scoreOne.textContent = '0'
        scoreTwo.textContent = '0'
        winningDiv.textContent = ''
        reachedFive.textContent = `${playerTwoParticipant.textContent} WON THE GAME!!`
        playerTwoScore = 0
    }
}

cellElements.forEach((cell) => {
    cell.addEventListener('click', handleClick, { once: true })
})

resetButton.addEventListener('click', resetGame)

getPlayerInfo()

// COMPUTER IMPLEMENTATION

let computer = 'C';

 
toggleAi.onclick = () => {
    toggleAi.onclick = 'disabled'
    computerDisplay()
    versusComputer();
    resetButton.removeEventListener('click', resetGame);
    resetButton.addEventListener('click', resetComputerGame)
}

let resetComputerGame = () => {
    document.getElementById('toggle-ai').click()
    cellElements.forEach((cell) => {
        cell.classList.remove(playerOne, computer);
        cell.textContent = ''
        cell.style.pointerEvents = 'auto'
        cell.style.pointerEvents = 'auto'
    })
}

let playerMove = (e) => {
    const cell = e.target;
    const index = gridArray.indexOf(e.target);
    const spliceNr = tracking.indexOf(index + 1)
    if (cell.classList.contains(computer)) {
        return;
    } else {
        cell.classList.add(playerOne);
        cell.textContent = playerOne;
        playerMarkStyle(cell, 'red');
        tracking.splice(spliceNr, 1);
    }
    if (checkAiWin(playerOne)) {
        computerDeclaration(false)
        playerOneScore++
    } else if (computerDraw()) {
        computerDeclaration(true);
    } else {
        computerMove();
    }
}

let computerDeclaration = (draw) => {
    if (draw) {
        winningDiv.textContent = 'Draw Game';
    } else if (checkAiWin(playerOne)) {
        winningDiv.textContent = `${playerOneParticipant.textContent} Wins!`;
        cellElements.forEach((cell) => {
            cell.style.pointerEvents = 'none'
        })
    } else if (checkAiWin(computer)) {
        winningDiv.textContent = `${playerTwoParticipant.textContent} Wins!`;
        cellElements.forEach((cell) => {
            cell.style.pointerEvents = 'none'
        })
    }
    winningDiv.classList.add('show')
}

let computerDraw = () => {
    return [...cellElements].every((cell) => {
        return cell.classList.contains(playerOne) ||
            cell.classList.contains(computer)
    })
}

let computerMove = () => {
    console.log('active function')
    const random = Math.floor(Math.random() * tracking.length);
    const computerIndex = tracking[random];
    cellElements[computerIndex - 1].classList.add(computer)
    cellElements[computerIndex - 1].textContent = computer;
    tracking.splice(random, 1);
    if (checkWin(computer)) {
        computerDeclaration(false)
        computerScore++
    }
}

let checkAiWin = (player) => {
    return WINNING_COMBINATIONS.some((combination) => {
        return combination.every((index) => {
            return cellElements[index].classList.contains(player)
        })
    })
}


// Display Adjustments For Computer

let computerDisplay = () => {
    removePlayerTwo()
    const playerContainer = document.getElementById('player-entries')
    playerContainer.style.display = 'flex'
    playerContainer.style.justifyContent = 'center'
    playerSubmit.removeEventListener('click', updateEntries);
    playerSubmit.addEventListener('click', enterAi)
}

let enterAi = () => {
    playerOneEntry = document.getElementById('player-one').value;
    playerOneParticipant.textContent = playerOneEntry;
    playerTwoParticipant.textContent = 'AI';
    document.getElementById('player-one').value = ''
    deactivateButtons()
}

let deactivateButtons = () => {
    toggleAi.style.pointerEvents = 'none';
    playerSubmit.style.pointerEvents = 'none';
}

let removePlayerTwo = () => {
    const playerTwoContainer = document.querySelector('.player-two-container');
    playerTwoContainer.remove()
}


let versusComputer = () => {
    cellElements.forEach((cell) => {
        cell.addEventListener('click', playerMove, { once: true })
    })
}
















