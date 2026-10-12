const boardSize = 4;
const targetTile = 2048;
const bestScoreKey = "tileSwipeFullBest";
const leaderboardKey = "tileSwipeFullScores";

let board = [];
let score = 0;
let playerName = "Guest";
let gameOver = false;
let won = false;
let previousState = null;

const boardElement = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const personalBestElement = document.getElementById("personal-best");
const leaderboardList = document.getElementById("leaderboard-list");

const modal = new bootstrap.Modal(document.getElementById("gameModal"));

function getSavedScores() {
  try {
    return JSON.parse(sessionStorage.getItem(leaderboardKey) || "[]");
  } catch {
    return [];
  }
}

function getBestScore() {
  return Number(localStorage.getItem(bestScoreKey)) || 0;
}

function updateScore() {
  scoreElement.textContent = score;

  if (score > getBestScore()) {
    localStorage.setItem(bestScoreKey, score);
  }

  bestScoreElement.textContent = getBestScore();

  if (personalBestElement) {
    personalBestElement.textContent = getBestScore();
  }
}

function createBoard() {
  board = Array.from(
    { length: boardSize },
    () => Array(boardSize).fill(0)
  );
}

function addRandomTile() {
  const emptyCells = [];

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 0) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) return;

  const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
}

function getTileColor(value) {
  const colors = {
    0: "#e7ddd1",
    2: "#f8e8d7",
    4: "#f2d4b8",
    8: "#eeb995",
    16: "#e99b79",
    32: "#df886c",
    64: "#d9795c",
    128: "#e5c36c",
    256: "#dfb34e",
    512: "#d8a03d",
    1024: "#c98986",
    2048: "#a85c58"
  };

  return colors[value] || "#8f6b84";
}

function renderBoard() {
  boardElement.innerHTML = "";

  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const value = board[r][c];
      const tile = document.createElement("div");

      tile.className = "tile";
      tile.setAttribute("role", "gridcell");
      tile.setAttribute(
        "aria-label",
        value === 0 ? "Empty tile" : `Tile ${value}`
      );
      tile.textContent = value === 0 ? "" : value;
      tile.style.backgroundColor = getTileColor(value);

      if (value >= 1024) {
        tile.style.color = "#ffffff";
      }

      boardElement.appendChild(tile);
    }
  }

  updateScore();
}

function savePreviousState() {
  previousState = {
    board: board.map(row => [...row]),
    score: score
  };
}

function startNewGame() {
  createBoard();
  score = 0;
  gameOver = false;
  won = false;
  previousState = null;

  addRandomTile();
  addRandomTile();
  renderBoard();
}

function compressLine(line) {
  const numbers = line.filter(value => value !== 0);
  const result = [];
  let gained = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === numbers[i + 1]) {
      const mergedValue = numbers[i] * 2;
      result.push(mergedValue);
      gained += mergedValue;
      i++;
    } else {
      result.push(numbers[i]);
    }
  }

  while (result.length < boardSize) {
    result.push(0);
  }

  return { line: result, gained };
}

function move(direction) {
  if (gameOver) return;

  const oldBoard = board.map(row => [...row]);
  let gainedPoints = 0;

  for (let i = 0; i < boardSize; i++) {
    let line;

    if (direction === "left" || direction === "right") {
      line = [...board[i]];

      if (direction === "right") {
        line.reverse();
      }

      const result = compressLine(line);
      line = result.line;
      gainedPoints += result.gained;

      if (direction === "right") {
        line.reverse();
      }

      board[i] = line;
    } else {
      line = board.map(row => row[i]);

      if (direction === "down") {
        line.reverse();
      }

      const result = compressLine(line);
      line = result.line;
      gainedPoints += result.gained;

      if (direction === "down") {
        line.reverse();
      }

      for (let r = 0; r < boardSize; r++) {
        board[r][i] = line[r];
      }
    }
  }

  const changed = board.some(
    (row, r) => row.some((value, c) => value !== oldBoard[r][c])
  );

  if (!changed) return;

  savePreviousState();
  score += gainedPoints;
  addRandomTile();
  renderBoard();
  checkGameStatus();
}

function canMove() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 0) return true;

      if (c + 1 < boardSize && board[r][c] === board[r][c + 1]) {
        return true;
      }

      if (r + 1 < boardSize && board[r][c] === board[r + 1][c]) {
        return true;
      }
    }
  }

  return false;
}

function checkGameStatus() {
  if (!won && board.some(row => row.includes(targetTile))) {
    won = true;
    finishGame(
      "You reached 2048!",
      `Amazing job, ${playerName}! You can keep playing or start a new game.`
    );
    return;
  }

  if (!canMove()) {
    finishGame(
      "Game Over",
      `Nice try, ${playerName}! Your final score was ${score}.`
    );
  }
}

function finishGame(title, message) {
  if (gameOver) return;

  gameOver = true;

  const scores = getSavedScores();
  scores.push({ name: playerName, score: score });
  scores.sort((a, b) => b.score - a.score);

  sessionStorage.setItem(
    leaderboardKey,
    JSON.stringify(scores.slice(0, 50))
  );

  renderLeaderboard();

  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalMessage").textContent = message;
  modal.show();
}

function undoMove() {
  if (!previousState || gameOver) return;

  board = previousState.board.map(row => [...row]);
  score = previousState.score;
  previousState = null;

  renderBoard();
}

function showHint() {
  if (gameOver) return;

  const directions = ["left", "right", "up", "down"];

  for (const direction of directions) {
    const oldBoard = board.map(row => [...row]);

    move(direction);

    const changed = board.some(
      (row, r) => row.some((value, c) => value !== oldBoard[r][c])
    );

    if (changed) {
      document.getElementById("modalTitle").textContent = "Hint";
      document.getElementById("modalMessage").textContent =
        `Try moving ${direction}!`;
      modal.show();

      // Restore the board because this was only a preview.
      board = oldBoard;
      renderBoard();
      previousState = null;
      return;
    }

    board = oldBoard;
  }

  document.getElementById("modalTitle").textContent = "No Moves";
  document.getElementById("modalMessage").textContent =
    "Try starting a new game!";
  modal.show();
}

function renderLeaderboard() {
  const scores = getSavedScores();
  const personalScores = scores
    .filter(entry => entry.name === playerName)
    .map(entry => entry.score);

  personalBestElement.textContent = personalScores.length
    ? Math.max(...personalScores)
    : 0;

  leaderboardList.innerHTML = "";

  if (scores.length === 0) {
    const item = document.createElement("li");
    item.className = "leaderboard-empty";
    item.textContent = "Finish a game to appear here!";
    leaderboardList.appendChild(item);
    return;
  }

  scores.slice(0, 5).forEach((entry, index) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    const points = document.createElement("strong");

    name.textContent = `${index + 1}. ${entry.name}`;
    points.textContent = entry.score;

    item.append(name, points);
    leaderboardList.appendChild(item);
  });
}

document.getElementById("name-form").addEventListener("submit", event => {
  event.preventDefault();

  const enteredName = document.getElementById("player-name").value.trim();
  playerName = enteredName || "Guest";

  document.getElementById("greeting").textContent = `Hello, ${playerName}!`;
  document.getElementById("name-section").classList.add("d-none");
  document.getElementById("game-section").classList.remove("d-none");

  startNewGame();
  renderLeaderboard();
});

document.getElementById("guest-btn").addEventListener("click", () => {
  playerName = "Guest";

  document.getElementById("greeting").textContent = `Hello, ${playerName}!`;
  document.getElementById("name-section").classList.add("d-none");
  document.getElementById("game-section").classList.remove("d-none");

  startNewGame();
  renderLeaderboard();
});

document.getElementById("reset-btn").addEventListener("click", startNewGame);
document.getElementById("modal-new-game").addEventListener("click", startNewGame);
document.getElementById("undo-btn").addEventListener("click", undoMove);
document.getElementById("hint-btn").addEventListener("click", showHint);

document.querySelectorAll("[data-dir]").forEach(button => {
  button.addEventListener("click", () => move(button.dataset.dir));
});

document.addEventListener("keydown", event => {
  const directions = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down"
  };

  if (directions[event.key] && !document.getElementById("game-section").hidden) {
    event.preventDefault();
    move(directions[event.key]);
  }
});

$(function () {
  $(".score-card").tooltip({
    items: "div",
    content: function () {
      return $(this).find("span").text();
    }
  });
});

bestScoreElement.textContent = getBestScore();
renderLeaderboard();