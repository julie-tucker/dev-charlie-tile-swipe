// tile swipe concept

// credits to https://www.geeksforgeeks.org/javascript/design-a-2048-game-in-javascript/, https://github.com/kubowania/2048,  and grok ai for figuring how to code a 2048 style game in js and debugging

// variables
const boardSize = 3;
let board = [];
let score = 0;
let playerName = "Guest";

// random guest names
const guestNames = [
  "Guest",
  "Noodle",
  "Bean",
  "Cloud",
  "Pebble",
  "Waffles",
];

// dom elements 
const nameSection = document.getElementById("name-section");
const gameinfo = document.getElementById("game-info");
const controls = document.getElementById("controls");
const greeting = document.getElementById("greeting");
const gameScore = document.getElementById("score");
const gameBoard = document.getElementById("game-board");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const nameInput = document.getElementById("player-name");

// start button
startButton.addEventListener("click", () => {
  const name = nameInput.value.trim();

  if (name) {
    playerName = name;
  } else {
    playerName = guestNames[Math.floor(Math.random() * guestNames.length)];
  }

  greeting.textContent = `Hello, ${playerName}!`;
  nameSection.style.display = "none";
  gameinfo.style.display = "block";
  controls.style.display = "block";

  startNewGame();
});

// reset button
resetButton.addEventListener("click", () => {
  startNewGame();
});

// empty board
function createNewBoard() {
  const newBoard = [];
  for (let i = 0; i < boardSize; i++) {
    newBoard[i] = [];
    for (let j = 0; j < boardSize; j++) {
      newBoard[i][j] = 0;
    }
  }
  return newBoard;
}

// start or reset game
function startNewGame() {
  board = createNewBoard();
  score = 0;
  gameScore.textContent = score;
  addRandomTile();
  addRandomTile();
  makeBoard();
  renderLeaderboard();
}

// add a random tile (2 or 4)
function addRandomTile() {
  const emptyCells = [];

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        emptyCells.push({ x: i, y: j });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
  }
}

// make the board; 3 by 3 grid with tiles; empty tiles gray; number tiles have a color based on value; credits to https://www.geeksforgeeks.org/javascript/design-a-2048-game-in-javascript/ and https://github.com/kubowania/2048for the logic of making the board
function makeBoard() {
  gameBoard.innerHTML = "";
  gameBoard.style.display = "grid";
  gameBoard.style.gridTemplateColumns = "repeat(3, 80px)";
  gameBoard.style.gridTemplateRows = "repeat(3, 80px)";
  gameBoard.style.gap = "8px";
  gameBoard.style.width = "max-content";

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");

      const value = board[i][j];
      tile.textContent = value === 0 ? "" : value;

      if (value > 0) {
        tile.style.backgroundColor = getTileColor(value);
        tile.style.color = "#fff";
      } else {
        tile.style.backgroundColor = "#e8e0d5";
      }

      gameBoard.appendChild(tile);
    }
  }
}

// tile colors; just for aesthetics
function getTileColor(value) {
  const colors = {
    2: "#D4A5A5",
    4: "#E07A5F",
    8: "#c96a52",
    16: "#b85c45",
    32: "#a04e3a",
    64: "#8a422f",
  };
  return colors[value] || "#5C4B3C";
}
function showModal(title, message) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalMessage').textContent = message;
  const modal = new bootstrap.Modal(document.getElementById('gameModal'));
  modal.show();
}
// check for win; you win after reaching a 64 tile; can change to 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, etc. by changing the number in the if statement below
function checkWin() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 64) { //change this number to make game easier or harder
        return true;
      }
    }
  }
  return false;
}

//check for lose; checks for any empty tiles then if there are adjacent tile with same value
function checkLose() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const current = board[i][j];

      // check right
      if (j < boardSize - 1 && current === board[i][j + 1]) {
        return false;
      }

      // check down
      if (i < boardSize - 1 && current === board[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

// movement, credits to https://www.geeksforgeeks.org/javascript/design-a-2048-game-in-javascript/ and https://github.com/kubowania/2048 for the logic of moving tiles and merging them and grok ai debug
function move(direction) {
  let moved = false;
  const oldBoard = board.map((row) => [...row]); // copy for comparison

  if (direction === "left") {
    for (let i = 0; i < boardSize; i++) {
      let row = board[i].filter((val) => val !== 0); // remove zeros
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          score += row[j];
          row.splice(j + 1, 1);
        }
      }
      while (row.length < boardSize) row.push(0);
      board[i] = row;
    }
  }

  if (direction === "right") {
    for (let i = 0; i < boardSize; i++) {
      let row = board[i].filter((val) => val !== 0);
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          score += row[j];
          row.splice(j - 1, 1);
          j--;
        }
      }
      while (row.length < boardSize) row.unshift(0);
      board[i] = row;
    }
  }

  if (direction === "up") {
    for (let j = 0; j < boardSize; j++) {
      let column = [];
      for (let i = 0; i < boardSize; i++) {
        if (board[i][j] !== 0) column.push(board[i][j]);
      }
      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          score += column[i];
          column.splice(i + 1, 1);
        }
      }
      while (column.length < boardSize) column.push(0);
      for (let i = 0; i < boardSize; i++) {
        board[i][j] = column[i];
      }
    }
  }

  if (direction === "down") {
    for (let j = 0; j < boardSize; j++) {
      let column = [];
      for (let i = 0; i < boardSize; i++) {
        if (board[i][j] !== 0) column.push(board[i][j]);
      }
      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          score += column[i];
          column.splice(i - 1, 1);
          i--;
        }
      }
      while (column.length < boardSize) column.unshift(0);
      for (let i = 0; i < boardSize; i++) {
        board[i][j] = column[i];
      }
    }
  }

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] !== oldBoard[i][j]) {
        moved = true;
      }
    }
  }

 if (moved) {
    addRandomTile();
    gameScore.textContent = score;
    makeBoard();


if (checkWin()) {
  saveScore();
  showModal("You Win!", `Congratulations ${playerName}! Final score: ${score}`);
} else if (checkLose()) {
  saveScore();
  showModal("Game Over", `Nice try ${playerName}. Final score: ${score}`);
}

  }
}

document.querySelectorAll("[data-dir]").forEach((btn) => {
  btn.addEventListener("click", () => {
    move(btn.dataset.dir);
  });
});

 // leaderboard elements
const bestScoreElement = document.getElementById("best-score");
const leaderboardList = document.getElementById("leaderboard-list");

const leaderboardKey = "tileSwipeScores";

// get saved scores
function getLeaderboard() {
  return JSON.parse(sessionStorage.getItem(leaderboardKey) || "[]");
}

// display top five scores
function renderLeaderboard() {
  const scores = getLeaderboard();

  leaderboardList.innerHTML = "";

  if (scores.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "leaderboard-empty";
    emptyMessage.textContent = "Finish a game to make the leaderboard!";
    leaderboardList.appendChild(emptyMessage);
    bestScoreElement.textContent = "0";
    return;
  }

  const playerScores = scores.filter(
    (entry) => entry.name === playerName
  );

  const bestScore = Math.max(...playerScores.map((entry) => entry.score));
  bestScoreElement.textContent = bestScore;

  scores.slice(0, 5).forEach((entry, index) => {
    const item = document.createElement("li");

    const player = document.createElement("span");
    player.textContent = `${index + 1}. ${entry.name}`;

    const points = document.createElement("strong");
    points.textContent = entry.score;

    item.appendChild(player);
    item.appendChild(points);
    leaderboardList.appendChild(item);
  });
}

// save game
function saveScore() {
  const scores = getLeaderboard();

  scores.push({
    name: playerName,
    score: score,
    date: new Date().toLocaleDateString()
  });

  scores.sort((a, b) => b.score - a.score);

  sessionStorage.setItem(leaderboardKey, JSON.stringify(scores));

  renderLeaderboard();
}

// show the player's saved scores
renderLeaderboard();

document.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
    const dir = e.key.replace("Arrow", "").toLowerCase();
    move(dir);
  }
});
