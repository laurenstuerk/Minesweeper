let grid = [];
let gridSize = 8;
let mineCount = 10;
let minesLocation = [];
let tilesClicked = 0;
let gameOver = false;
let timeElapsed = 0;
let timer = 0;
let screenSize = 1;

// Difficulty presets
let difficulty_presets = {
    beginner: {
        gridSize: 8,
        mineCount: 10,
        screenSize: 400,
        gridWidth: 400,
        gridHeight: 400,
    },
    intermediate: {
        gridSize: 16,
        mineCount: 40,
        screenSize: 800,
        gridWidth: 800,
        gridHeight: 800,
    },
    expert: {
        gridSize: 22,
        mineCount: 99,
        screenSize: 1100,
        gridWidth: 1,
        gridHeight: 1,

    },
};


const difficulty = document.querySelector("#difficulty");

// Initialize game on start button click
document.querySelector("#startBtn").addEventListener("click", startGame);




function startGame() {
    // Reset game state
    grid = [];
    minesLocation = [];
    tilesClicked = 0;
    gameOver = false;
    timeElapsed = 0;
    clearInterval(timer);
    document.getElementById("mines-count").innerText = mineCount;

    // Clear grid
    const gridElement = document.getElementById("grid");
    gridElement.innerHTML = "";

    // Set difficulty
    if (difficulty.value === "beginner") {
        gridSize = difficulty_presets.beginner.gridSize;
        mineCount = difficulty_presets.beginner.mineCount;
        screenSize = difficulty_presets.beginner.screenSize;
    } else if (difficulty.value === "intermediate") {
        gridSize = difficulty_presets.intermediate.gridSize;
        mineCount = difficulty_presets.intermediate.mineCount;
        screenSize = difficulty_presets.intermediate.screenSize;
    }
    else if (difficulty.value === "expert") {
        gridSize = difficulty_presets.expert.gridSize;
        mineCount = difficulty_presets.expert.mineCount;
        screenSize = difficulty_presets.expert.screenSize;
    }
    document.getElementById("grid").style.width = screenSize + 'px';
    document.getElementById("grid").style.height = screenSize + 'px';


    const existingOverlay = document.querySelector('.game-over-overlay');
    if (existingOverlay) {
        existingOverlay.remove();
    }

    // Create grid
    for (let r = 0; r < gridSize; r++) {
        let row = [];
        for (let c = 0; c < gridSize; c++) {
            let tile = document.createElement("div");
            tile.id = `${r}-${c}`;
            tile.addEventListener("click", clickTile);
            tile.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                placeFlag(tile);
            });
            tile.className = "tile";
            gridElement.append(tile);
            row.push(tile);
        }
        grid.push(row);
    }

    startTimer();
    setMines();
}

function startTimer() {
    const timerDisplay = document.getElementById("timer");
    timer = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}


function setMines() {
    let minesLeft = mineCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * gridSize);
        let c = Math.floor(Math.random() * gridSize);
        let id = `${r}-${c}`;

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft--;
        }
    }
}

// Flag Place Function========================
function placeFlag(tile) {
    if (gameOver || tile.classList.contains("tile-clicked")) return;

    if (tile.classList.contains("flagged")) {
        tile.classList.remove("flagged");
        tile.innerText = "";
        updateMineCount(1);
    } else {
        tile.classList.add("flagged");
        tile.innerText = "🚩";
        updateMineCount(-1);
    }
}

function updateMineCount(change) {
    const minesDisplay = document.getElementById("mines-count");
    const currentCount = parseInt(minesDisplay.innerText);
    minesDisplay.innerText = currentCount + change;
}

// Click Tile Function========================
function clickTile() {
    // iff the Game is over or the tile is already clicked or flagged, then return (nothing happens)
    if (gameOver || this.classList.contains("tile-clicked") || this.classList.contains("flagged")) {
        return;
    }

    // Check if tile is a mine
    if (minesLocation.includes(this.id)) {
        gameOver = true;
        clearInterval(timer);
        revealMines();
        showGameOver(false);
        playAudio('./sound/bomb.mp3');
        return;
    }

    let [r, c] = this.id.split("-").map(Number);
    checkMine(r, c);

    // Check for win
    if (tilesClicked === gridSize * gridSize - mineCount) {
        gameOver = true;
        clearInterval(timer);
        showGameOver(true);
    }
}

// Show game over message
function showGameOver(won) {
    const message = won ? "Congratulations! You Won! 🎉" : "Game Over! 💣"; //Ternary operator
    const overlay = document.createElement("div");
    overlay.className = "game-over-overlay";
    overlay.innerHTML = `
        <div class="game-over-message">
            ${message}<br>
            Time: ${timeElapsed}s<br>
            <button onclick="startGame()">Play Again</button>
        </div>
    `;
    document.body.appendChild(overlay);
    const outcome = won ? document.createElement("div") : "";
    outcome.className = "outcome";
    outcome.innerHTML = `
        <div class="game-over-message">
            ${message}<br>
            ${difficulty.value}<br>
            Time: ${timeElapsed}s<br>       
        </div>
    `;
    document.getElementById("winsContainer").appendChild(outcome);

}

function revealMines() {
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            let tile = grid[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

// function to check if the tile is a mine or not. if not, recursively check the adjacent tiles by calling the function again until all the adjacent tiles are checked and no mines are found and then display the number of mines found in the adjacent tiles.
function checkMine(r, c) {
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) {
        return;
    }
    // Get the tile by its row and column
    let tile = grid[r][c];
    if (tile.classList.contains("tile-clicked")) {
        return;
    }

    tile.classList.add("tile-clicked");
    console.log(tile.id);
    tilesClicked += 1;
    tile.style.backgroundColor = "lightgreen";
    playAudio('./sound/tile.mp3');

    let minesFound = 0;

    // Check all 8 adjacent tiles
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            let newR = r + i;
            let newC = c + j;
            if (newR >= 0 && newR < gridSize && newC >= 0 && newC < gridSize) {
                if (minesLocation.includes(`${newR}-${newC}`)) {
                    minesFound++;
                }
            }
        }
    }

    if (minesFound > 0) {
        tile.innerText = minesFound;
        tile.classList.add(`x${minesFound}`);
    } else {
        // If no mines found, recursively check adjacent tiles
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                checkMine(r + i, c + j);
            }
        }
    }
}


startGame();



function playAudio(fileName) {
    if (document.getElementById("checkboxInput").checked == true) {
        return;
    }
    let audio = new Audio(fileName);
    audio.play();
}