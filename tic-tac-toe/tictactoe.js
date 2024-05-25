document.getElementById("home").addEventListener('click', function() {
  window.location.href = "/site/#stuff";
})

const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('game-board');
const winningMessageElement = document.getElementById('winning-message');
const winningMessageTextElement = document.getElementById('winning-message-text');
const restartButton = document.getElementById('restart-button');
const gameModeMenu = document.getElementById('game-menu');
const menu_single = document.getElementById('singleplayer');
const menu_multi = document.getElementById('multiplayer');
const startingPlayerMessageElement = document.getElementById('whostarts?');
let circleTurn;
let singlePlayer = true;

menu_single.addEventListener('click', function() {
  gameModeMenu.style.display = 'none';
  singlePlayer = true;
  startGame();
})

menu_multi.addEventListener('click', function() {
  gameModeMenu.style.display = 'none';
  singlePlayer = false;
  startGame();
});

function startGame() {
  if (Math.random() < 0.5) {
    circleTurn = false; // AI goes first
    if (singlePlayer) {
      startingPlayerMessageElement.innerText = "AI (X) starts";
    } else {
      startingPlayerMessageElement.innerText = "X starts";
    }
  } else {
    circleTurn = true; // player goes first
    if (singlePlayer) {
      startingPlayerMessageElement.innerText = "player (O) starts";
    } else {
      startingPlayerMessageElement.innerText = "O starts";
    }
  }
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.style.backgroundColor = 'white';
    cell.innerText = '';
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick);
  });
  board.style.display = 'grid';
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
  
  if (singlePlayer && !circleTurn) {
    cellElements.forEach(cell => {
      cell.removeEventListener('click', handleClick);
    });
    setTimeout(() => {
      computerMove();
      cellElements.forEach(cell => {
        cell.addEventListener('click', handleClick);
      });
    }, 300);
  }
}

function handleClick(e) {
  if (singlePlayer && !circleTurn) return; 

  const cell = e.target;
  
  if (cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)) {
    return;
  }
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  startingPlayerMessageElement.innerText = "";
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    if (singlePlayer && !circleTurn) {
      cellElements.forEach(cell => {
        cell.removeEventListener('click', handleClick);
      });
      setTimeout(computerMove, 300);
      cellElements.forEach(cell => {
        cell.addEventListener('click', handleClick);
      });
    }
    setBoardHoverClass();
  }
}


function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'draw.';
  } else if (singlePlayer) {
    winningMessageTextElement.innerText = `${circleTurn ? "player" : "AI"} wins!`;
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "o" : "x"} wins!`;
  }
  winningMessageElement.classList.add('show');
  gameModeMenu.style.display = 'block';
  cellElements.forEach(cell => {
    cell.removeEventListener('click', handleClick);
  });
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.style.backgroundColor = circleTurn ? 'pink' : 'skyblue';
  cell.innerText = circleTurn ? 'O' : 'X';
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function computerMove() {
  if (Math.random() < 0.85) {
    const bestMove = minimax([...cellElements], X_CLASS).index;
    const cell = cellElements[bestMove];
    placeMark(cell, X_CLASS); // AI is always X
    if (checkWin(X_CLASS)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }
  } else {
    const emptyCells = [...cellElements].filter(cell => 
      !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)
    );
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];
    placeMark(cell, X_CLASS);
    if (checkWin(X_CLASS)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();
      setBoardHoverClass();
    }
  }
}

function minimax(newBoard, player) {
  const availSpots = newBoard.filter(cell => 
    !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)
  );

  if (checkWinPlayer(newBoard, CIRCLE_CLASS)) {
    return { score: -10 };
  } else if (checkWinPlayer(newBoard, X_CLASS)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = newBoard.indexOf(availSpots[i]);
    newBoard[move.index].classList.add(player);

    if (player === X_CLASS) {
      const result = minimax(newBoard, CIRCLE_CLASS);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, X_CLASS);
      move.score = result.score;
    }

    newBoard[move.index].classList.remove(X_CLASS, CIRCLE_CLASS);
    moves.push(move);
  }

  let bestMove;
  if (player === X_CLASS) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

function checkWinPlayer(board, currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return board[index].classList.contains(currentClass);
    });
  });
}
