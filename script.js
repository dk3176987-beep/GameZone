"use strict";

/* ===================================
   GAMEZONE - GAME LIBRARY
   =================================== */

const games = [
  { id: "snake", name: "Snake Game", emoji: "🐍", category: "Arcade", description: "Eat food and grow your snake." },
  { id: "tic-tac-toe", name: "Tic Tac Toe", emoji: "❌", category: "Puzzle", description: "Play X and O with a friend." },
  { id: "rps", name: "Rock Paper Scissors", emoji: "✂️", category: "Casual", description: "Challenge the computer." },
  { id: "memory", name: "Memory Match", emoji: "🧠", category: "Puzzle", description: "Find matching pairs of cards." },
  { id: "guess", name: "Number Guessing", emoji: "🔢", category: "Puzzle", description: "Guess the hidden number." },
  { id: "flappy", name: "Flappy Bird", emoji: "🐦", category: "Arcade", description: "Fly through the pipes." },
  { id: "car", name: "Car Racing", emoji: "🏎️", category: "Racing", description: "Avoid obstacles and survive." },
  { id: "space", name: "Space Shooter", emoji: "🚀", category: "Arcade", description: "Shoot incoming enemies." },
  { id: "breakout", name: "Breakout", emoji: "🧱", category: "Arcade", description: "Break the bricks with a ball." },
  { id: "pong", name: "Ping Pong", emoji: "🏓", category: "Sports", description: "Play against the computer." },
  { id: "2048", name: "2048 Puzzle", emoji: "🔢", category: "Puzzle", description: "Combine tiles to reach 2048." },
  { id: "minesweeper", name: "Minesweeper", emoji: "💣", category: "Puzzle", description: "Find safe cells and avoid mines." },
  { id: "mole", name: "Whack-a-Mole", emoji: "🐹", category: "Arcade", description: "Hit the mole as fast as possible." },
  { id: "simon", name: "Simon Memory", emoji: "🎨", category: "Memory", description: "Remember and repeat the sequence." },
  { id: "platform", name: "Platform Jumper", emoji: "🦘", category: "Arcade", description: "Jump between platforms." }
];

const gameGrid = document.getElementById("gameGrid");
const gameSearch = document.getElementById("gameSearch");
const gameArea = document.getElementById("gameArea");
const gameTitle = document.getElementById("gameTitle");
const gameContainer = document.getElementById("gameContainer");
const closeGameButton = document.getElementById("closeGame");
const noResults = document.getElementById("noResults");

let cleanupGame = null;

function renderGames(query = "") {
  const filtered = games.filter(game =>
    (game.name + " " + game.category + " " + game.description)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  gameGrid.innerHTML = "";

  filtered.forEach(game => {
    const card = document.createElement("article");
    card.className = "game-card";

    card.innerHTML = `
      <div class="game-icon">${game.emoji}</div>
      <p class="game-category">${game.category}</p>
      <h3>${game.name}</h3>
      <p>${game.description}</p>
      <button class="play-button" data-game="${game.id}">
        Play Now 🎮
      </button>
    `;

    gameGrid.appendChild(card);
  });

  noResults.hidden = filtered.length !== 0;
}

function openGame(id) {
  const game = games.find(item => item.id === id);

  if (!game) {
    alert("Game nahi mila!");
    return;
  }

  stopGame();

  gameArea.hidden = false;
  gameTitle.textContent = `${game.emoji} ${game.name}`;
  gameContainer.innerHTML = "";

  window.scrollTo({
    top: gameArea.getBoundingClientRect().top + window.scrollY - 80,
    behavior: "smooth"
  });

  const launchers = {
    "snake": snakeGame,
    "tic-tac-toe": ticTacToe,
    "rps": rockPaperScissors,
    "memory": memoryMatch,
    "guess": numberGuessing,
    "flappy": flappyBird,
    "car": carRacing,
    "space": spaceShooter,
    "breakout": breakoutGame,
    "pong": pingPong,
    "2048": puzzle2048,
    "minesweeper": minesweeper,
    "mole": whackAMole,
    "simon": simonMemory,
    "platform": platformJumper
  };

  launchers[id]();
}

function showGame(html) {
  gameContainer.innerHTML = html;
}

function setCleanup(callback) {
  cleanupGame = callback;
}

function stopGame() {
  if (typeof cleanupGame === "function") {
    cleanupGame();
  }

  cleanupGame = null;
}

function closeGame() {
  stopGame();
  gameArea.hidden = true;
  gameContainer.innerHTML = "";
}

gameGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-game]");
  if (button) openGame(button.dataset.game);
});

gameSearch.addEventListener("input", () => {
  renderGames(gameSearch.value);
});

closeGameButton.addEventListener("click", closeGame);

renderGames();

/* ===================================
   1. SNAKE GAME
   =================================== */

function snakeGame() {
  showGame(`
    <p>Arrow keys से snake चलाओ।</p>
    <canvas id="snakeCanvas" width="400" height="400"></canvas>
    <p id="snakeScore">Score: 0</p>
    <button id="snakeRestart">Restart</button>
  `);

  const canvas = document.getElementById("snakeCanvas");
  const ctx = canvas.getContext("2d");
  const scoreText = document.getElementById("snakeScore");
  const size = 20;
  const total = 20;

  let snake, food, dx, dy, score, timer, ended;

  function reset() {
    clearInterval(timer);
    snake = [{ x: 10, y: 10 }];
    food = { x: 5, y: 5 };
    dx = 1;
    dy = 0;
    score = 0;
    ended = false;
    scoreText.textContent = "Score: 0";
    draw();
    timer = setInterval(tick, 120);
  }

  function draw() {
    ctx.fillStyle = "#101820";
    ctx.fillRect(0, 0, 400, 400);

    ctx.fillStyle = "#35d058";
    snake.forEach(p => ctx.fillRect(p.x * size, p.y * size, 18, 18));

    ctx.fillStyle = "#ff4545";
    ctx.fillRect(food.x * size, food.y * size, 18, 18);
  }

  function tick() {
    if (ended) return;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (
      head.x < 0 || head.y < 0 ||
      head.x >= total || head.y >= total ||
      snake.some(p => p.x === head.x && p.y === head.y)
    ) {
      ended = true;
      clearInterval(timer);
      scoreText.textContent = `Game Over! Score: ${score}`;
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      scoreText.textContent = `Score: ${score}`;

      do {
        food = {
          x: Math.floor(Math.random() * total),
          y: Math.floor(Math.random() * total)
        };
      } while (snake.some(p => p.x === food.x && p.y === food.y));
    } else {
      snake.pop();
    }

    draw();
  }

  function keyHandler(event) {
    const directions = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0]
    };

    if (!directions[event.key]) return;

    event.preventDefault();

    const [nx, ny] = directions[event.key];

    if (nx !== -dx || ny !== -dy) {
      dx = nx;
      dy = ny;
    }
  }

  document.addEventListener("keydown", keyHandler);
  document.getElementById("snakeRestart").onclick = reset;

  setCleanup(() => {
    clearInterval(timer);
    document.removeEventListener("keydown", keyHandler);
  });

  reset();
}

/* ===================================
   2. TIC TAC TOE
   =================================== */

function ticTacToe() {
  showGame(`
    <h3 id="tttStatus">Player X की बारी</h3>
    <div id="tttBoard" class="ttt-board"></div>
    <button id="tttReset">Restart</button>
    <style>
      .ttt-board {
        display:grid;
        grid-template-columns:repeat(3,80px);
        gap:6px;
        justify-content:center;
        margin:20px;
      }
      .ttt-board button {
        height:80px;
        font-size:28px;
      }
    </style>
  `);

  const board = document.getElementById("tttBoard");
  const status = document.getElementById("tttStatus");
  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  let cells, player, finished;

  function reset() {
    cells = Array(9).fill("");
    player = "X";
    finished = false;
    status.textContent = "Player X की बारी";
    render();
  }

  function render() {
    board.innerHTML = "";

    cells.forEach((value, i) => {
      const button = document.createElement("button");
      button.textContent = value;
      button.onclick = () => play(i);
      board.appendChild(button);
    });
  }

  function play(i) {
    if (finished || cells[i]) return;

    cells[i] = player;

    if (wins.some(line => line.every(n => cells[n] === player))) {
      status.textContent = `Player ${player} जीत गया! 🎉`;
      finished = true;
    } else if (cells.every(Boolean)) {
      status.textContent = "Match Draw!";
      finished = true;
    } else {
      player = player === "X" ? "O" : "X";
      status.textContent = `Player ${player} की बारी`;
    }

    render();
  }

  document.getElementById("tttReset").onclick = reset;
  reset();
}

/* ===================================
   3. ROCK PAPER SCISSORS
   =================================== */

function rockPaperScissors() {
  showGame(`
    <h3>अपना चुनाव करो</h3>
    <button data-rps="Rock">🪨 Rock</button>
    <button data-rps="Paper">📄 Paper</button>
    <button data-rps="Scissors">✂️ Scissors</button>
    <h3 id="rpsResult">Ready?</h3>
    <p id="rpsScore">You: 0 | Computer: 0</p>
  `);

  let you = 0, computer = 0;

  gameContainer.querySelectorAll("[data-rps]").forEach(button => {
    button.onclick = () => {
      const user = button.dataset.rps;
      const options = ["Rock", "Paper", "Scissors"];
      const cpu = options[Math.floor(Math.random() * 3)];

      let result;

      if (user === cpu) {
        result = "Draw!";
      } else if (
        (user === "Rock" && cpu === "Scissors") ||
        (user === "Paper" && cpu === "Rock") ||
        (user === "Scissors" && cpu === "Paper")
      ) {
        you++;
        result = "तुम जीत गए!";
      } else {
        computer++;
        result = "Computer जीत गया!";
      }

      document.getElementById("rpsResult").textContent =
        `${user} vs ${cpu}: ${result}`;

      document.getElementById("rpsScore").textContent =
        `You: ${you} | Computer: ${computer}`;
    };
  });
}

/* ===================================
   4. MEMORY MATCH
   =================================== */

function memoryMatch() {
  showGame(`
    <p>एक जैसी जोड़ियाँ खोजो!</p>
    <div id="memoryBoard" class="memory-board"></div>
    <p id="memoryStatus">Find the pairs!</p>
    <button id="memoryReset">Restart</button>
    <style>
      .memory-board {
        display:grid;
        grid-template-columns:repeat(4,65px);
        gap:7px;
        justify-content:center;
      }
      .memory-board button {height:65px;font-size:24px;}
    </style>
  `);

  const board = document.getElementById("memoryBoard");
  const status = document.getElementById("memoryStatus");
  const symbols = ["🍎","🍌","🍇","🍒","🍉","🥝","🍍","🥥"];

  let cards, first, locked, matches, timer;

  function reset() {
    clearTimeout(timer);
    cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    first = null;
    locked = false;
    matches = 0;
    status.textContent = "Find the pairs!";
    render();
  }

  function render() {
    board.innerHTML = "";

    cards.forEach((symbol, i) => {
      const button = document.createElement("button");
      button.textContent = "❓";
      button.dataset.open = "false";

      button.onclick = () => {
        if (locked || button.dataset.open === "true") return;

        button.textContent = symbol;
        button.dataset.open = "true";

        if (!first) {
          first = button;
          return;
        }

        if (first.textContent === button.textContent) {
          first.disabled = true;
          button.disabled = true;
          first = null;
          matches++;

          if (matches === symbols.length) {
            status.textContent = "You Win! 🎉";
          }
        } else {
          locked = true;
          const previous = first;
          first = null;

          timer = setTimeout(() => {
            previous.textContent = "❓";
            button.textContent = "❓";
            previous.dataset.open = "false";
            button.dataset.open = "false";
            locked = false;
          }, 700);
        }
      };

      board.appendChild(button);
    });
  }

  document.getElementById("memoryReset").onclick = reset;
  setCleanup(() => clearTimeout(timer));
  reset();
}

/* ===================================
   5. NUMBER GUESSING
   =================================== */

function numberGuessing() {
  showGame(`
    <p>1 से 100 के बीच नंबर पहचानो।</p>
    <input id="guessInput" type="number" min="1" max="100" placeholder="Enter number">
    <button id="guessButton">Guess</button>
    <p id="guessMessage">Good luck!</p>
    <button id="guessReset">New Game</button>
  `);

  let secret, attempts;

  function reset() {
    secret = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById("guessInput").value = "";
    document.getElementById("guessMessage").textContent = "Good luck!";
  }

  document.getElementById("guessButton").onclick = () => {
    const input = document.getElementById("guessInput");
    const guess = Number(input.value);
    const message = document.getElementById("guessMessage");

    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
      message.textContent = "1 से 100 के बीच नंबर डालो।";
      return;
    }

    attempts++;

    if (guess === secret) {
      message.textContent = `सही जवाब! ${attempts} कोशिशों में जीत गए।`;
    } else if (guess < secret) {
      message.textContent = "थोड़ा बड़ा नंबर ट्राई करो।";
    } else {
      message.textContent = "थोड़ा छोटा नंबर ट्राई करो।";
    }
  };

  document.getElementById("guessReset").onclick = reset;
  reset();
}

/* ===================================
   6. FLAPPY BIRD
   =================================== */

function flappyBird() {
  showGame(`
    <p>Space या canvas पर क्लिक करके उड़ो।</p>
    <canvas id="flappyCanvas" width="360" height="420"></canvas>
    <p id="flappyScore">Score: 0</p>
  `);

  const canvas = document.getElementById("flappyCanvas");
  const ctx = canvas.getContext("2d");
  const scoreText = document.getElementById("flappyScore");

  let birdY, velocity, pipes, score, running, timer;

  function reset() {
    birdY = 200;
    velocity = 0;
    pipes = [];
    score = 0;
    running = true;
    scoreText.textContent = "Score: 0";
    clearInterval(timer);
    timer = setInterval(tick, 25);
    draw();
  }

  function flap() {
    if (!running) {
      reset();
      return;
    }

    velocity = -6;
  }

  function keyHandler(event) {
    if (event.code === "Space") {
      event.preventDefault();
      flap();
    }
  }

  function draw() {
    ctx.fillStyle = "#9de4ff";
    ctx.fillRect(0, 0, 360, 420);

    ctx.fillStyle = "#2b9b43";

    pipes.forEach(pipe => {
      ctx.fillRect(pipe.x, 0, 45, pipe.gap - 65);
      ctx.fillRect(pipe.x, pipe.gap + 65, 45, 420 - pipe.gap - 65);
    });

    ctx.fillStyle = "#ffbd22";
    ctx.beginPath();
    ctx.arc(70, birdY, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick() {
    if (!running) return;

    velocity += 0.3;
    birdY += velocity;

    if (!pipes.length || pipes[pipes.length - 1].x < 180) {
      pipes.push({ x: 360, gap: 100 + Math.random() * 200, scored: false });
    }

    pipes.forEach(pipe => {
      pipe.x -= 2;

      if (!pipe.scored && pipe.x + 45 < 70) {
        pipe.scored = true;
        score++;
        scoreText.textContent = `Score: ${score}`;
      }
    });

    pipes = pipes.filter(pipe => pipe.x > -50);

    const hit = pipes.some(pipe =>
      82 > pipe.x && 58 < pipe.x + 45 &&
      (birdY - 12 < pipe.gap - 65 || birdY + 12 > pipe.gap + 65)
    );

    if (birdY < 0 || birdY > 420 || hit) {
      running = false;
      scoreText.textContent = `Game Over! Score: ${score}. Click to restart.`;
    }

    draw();
  }

  canvas.addEventListener("click", flap);
  document.addEventListener("keydown", keyHandler);

  setCleanup(() => {
    clearInterval(timer);
    canvas.removeEventListener("click", flap);
    document.removeEventListener("keydown", keyHandler);
  });

  reset();
}

/* ===================================
   7. CAR RACING
   =================================== */

function carRacing() {
  showGame(`
    <p>← → से कार चलाओ।</p>
    <canvas id="carCanvas" width="300" height="440"></canvas>
    <p id="carScore">Score: 0</p>
    <button id="carReset">Restart</button>
  `);

  const canvas = document.getElementById("carCanvas");
  const ctx = canvas.getContext("2d");
  const scoreText = document.getElementById("carScore");

  let carX, obstacles, score, frame, running, timer;

  function reset() {
    carX = 130;
    obstacles = [];
    score = 0;
    frame = 0;
    running = true;
    scoreText.textContent = "Score: 0";
    clearInterval(timer);
    timer = setInterval(tick, 30);
  }

  function keyHandler(event) {
    if (event.key === "ArrowLeft") carX = Math.max(5, carX - 20);
    if (event.key === "ArrowRight") carX = Math.min(260, carX + 20);
  }

  function tick() {
    if (!running) return;

    frame++;

    if (frame % 45 === 0) {
      obstacles.push({ x: 10 + Math.random() * 240, y: -50 });
    }

    obstacles.forEach(o => o.y += 4);
    obstacles = obstacles.filter(o => o.y < 450);

    if (obstacles.some(o =>
      carX < o.x + 35 && carX + 35 > o.x &&
      350 < o.y + 55 && 405 > o.y
    )) {
      running = false;
      scoreText.textContent = `Crash! Score: ${score}`;
    } else {
      score++;
      scoreText.textContent = `Score: ${score}`;
    }

    ctx.fillStyle = "#444";
    ctx.fillRect(0, 0, 300, 440);

    ctx.fillStyle = "#fff";
    for (let y = 0; y < 440; y += 70) {
      ctx.fillRect(145, (y + frame * 4) % 440, 7, 35);
    }

    ctx.fillStyle = "#2ad";
    ctx.fillRect(carX, 350, 35, 55);

    ctx.fillStyle = "#f44";
    obstacles.forEach(o => ctx.fillRect(o.x, o.y, 35, 55));
  }

  document.addEventListener("keydown", keyHandler);
  document.getElementById("carReset").onclick = reset;

  setCleanup(() => {
    clearInterval(timer);
    document.removeEventListener("keydown", keyHandler);
  });

  reset();
}

/* ===================================
   8. SPACE SHOOTER
   =================================== */

function spaceShooter() {
  showGame(`
    <p>Arrow keys से चलो, Space से shoot करो।</p>
    <canvas id="spaceCanvas" width="360" height="440"></canvas>
    <p id="spaceScore">Score: 0</p>
  `);

  const canvas = document.getElementById("spaceCanvas");
  const ctx = canvas.getContext("2d");
  const scoreText = document.getElementById("spaceScore");

  let x = 165, bullets = [], enemies = [], score = 0;
  let running = true, frame = 0;
  const keys = {};

  function keyDown(event) {
    keys[event.key] = true;

    if (event.code === "Space") {
      event.preventDefault();
      bullets.push({ x: x + 14, y: 380 });
    }
  }

  function keyUp(event) {
    keys[event.key] = false;
  }

  function tick() {
    if (!running) return;

    if (keys.ArrowLeft) x = Math.max(0, x - 5);
    if (keys.ArrowRight) x = Math.min(330, x + 5);

    frame++;

    if (frame % 40 === 0) {
      enemies.push({ x: Math.random() * 330, y: -20 });
    }

    bullets.forEach(b => b.y -= 7);
    enemies.forEach(e => e.y += 2);

    bullets = bullets.filter(b => b.y > -10);

    enemies.forEach(enemy => {
      const index = bullets.findIndex(b =>
        b.x >= enemy.x - 4 && b.x <= enemy.x + 25 &&
        b.y >= enemy.y && b.y <= enemy.y + 25
      );

      if (index !== -1) {
        bullets.splice(index, 1);
        enemy.y = 500;
        score++;
        scoreText.textContent = `Score: ${score}`;
      }

      if (enemy.y > 370 && enemy.x > x - 20 && enemy.x < x + 40) {
        running = false;
        scoreText.textContent = `Game Over! Score: ${score}`;
      }
    });

    enemies = enemies.filter(e => e.y < 450);

    ctx.fillStyle = "#080820";
    ctx.fillRect(0, 0, 360, 440);

    ctx.fillStyle = "#3df";
    ctx.fillRect(x, 390, 30, 25);

    ctx.fillStyle = "#ffec63";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 10));

    ctx.fillStyle = "#f44";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, 25, 25));
  }

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  const timer = setInterval(tick, 25);

  setCleanup(() => {
    clearInterval(timer);
    document.removeEventListener("keydown", keyDown);
    document.removeEventListener("keyup", keyUp);
  });
}

/* ===================================
   9. BREAKOUT
   =================================== */

function breakoutGame() {
  showGame(`
    <p>Mouse से paddle चलाओ।</p>
    <canvas id="breakCanvas" width="360" height="420"></canvas>
    <p id="breakStatus">Break the bricks!</p>
  `);

  const canvas = document.getElementById("breakCanvas");
  const ctx = canvas.getContext("2d");
  const status = document.getElementById("breakStatus");

  let paddleX = 140, ballX = 180, ballY = 300;
  let dx = 3, dy = -3, running = true, timer;
  const bricks = [];

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 7; col++) {
      bricks.push({
        x: 8 + col * 50,
        y: 30 + row * 25,
        alive: true
      });
    }
  }

  function mouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    paddleX = (event.clientX - rect.left) * 360 / rect.width - 40;
    paddleX = Math.max(0, Math.min(280, paddleX));
  }

  function tick() {
    if (!running) return;

    ballX += dx;
    ballY += dy;

    if (ballX < 5 || ballX > 355) dx *= -1;
    if (ballY < 5) dy *= -1;

    if (ballY >= 380 && ballX >= paddleX && ballX <= paddleX + 80) {
      dy = -Math.abs(dy);
    }

    bricks.forEach(brick => {
      if (brick.alive &&
          ballX >= brick.x && ballX <= brick.x + 45 &&
          ballY >= brick.y && ballY <= brick.y + 18) {
        brick.alive = false;
        dy *= -1;
      }
    });

    if (ballY > 420) {
      running = false;
      status.textContent = "Game Over!";
    }

    if (bricks.every(b => !b.alive)) {
      running = false;
      status.textContent = "You Win! 🎉";
    }

    ctx.fillStyle = "#101820";
    ctx.fillRect(0, 0, 360, 420);

    ctx.fillStyle = "#4ae";
    bricks.filter(b => b.alive).forEach(b => ctx.fillRect(b.x, b.y, 45, 18));

    ctx.fillStyle = "#fff";
    ctx.fillRect(paddleX, 390, 80, 10);

    ctx.beginPath();
    ctx.arc(ballX, ballY, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener("mousemove", mouseMove);
  timer = setInterval(tick, 20);

  setCleanup(() => {
    clearInterval(timer);
    canvas.removeEventListener("mousemove", mouseMove);
  });
}

/* ===================================
   10. PING PONG
   =================================== */

function pingPong() {
  showGame(`
    <p>Mouse से paddle चलाओ।</p>
    <canvas id="pongCanvas" width="360" height="420"></canvas>
    <p id="pongScore">You: 0 | Computer: 0</p>
  `);

  const canvas = document.getElementById("pongCanvas");
  const ctx = canvas.getContext("2d");
  const scoreText = document.getElementById("pongScore");

  let playerY = 180, cpuY = 180;
  let ballX = 180, ballY = 210;
  let dx = 3, dy = 2;
  let playerScore = 0, cpuScore = 0;

  function mouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    playerY = (event.clientY - rect.top) * 420 / rect.height - 40;
    playerY = Math.max(0, Math.min(340, playerY));
  }

  function tick() {
    ballX += dx;
    ballY += dy;

    if (ballY < 5 || ballY > 415) dy *= -1;

    cpuY += (ballY - (cpuY + 40)) * 0.07;

    if (ballX < 20 && ballY >= playerY && ballY <= playerY + 80) {
      dx = Math.abs(dx);
    }

    if (ballX > 340 && ballY >= cpuY && ballY <= cpuY + 80) {
      dx = -Math.abs(dx);
    }

    if (ballX < 0 || ballX > 360) {
      if (ballX < 0) cpuScore++;
      else playerScore++;

      ballX = 180;
      ballY = 210;
      dx = ballX < 180 ? 3 : -3;

      scoreText.textContent =
        `You: ${playerScore} | Computer: ${cpuScore}`;
    }

    ctx.fillStyle = "#101820";
    ctx.fillRect(0, 0, 360, 420);

    ctx.fillStyle = "#fff";
    ctx.fillRect(8, playerY, 10, 80);
    ctx.fillRect(342, cpuY, 10, 80);

    ctx.beginPath();
    ctx.arc(ballX, ballY, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener("mousemove", mouseMove);
  const timer = setInterval(tick, 20);

  setCleanup(() => {
    clearInterval(timer);
    canvas.removeEventListener("mousemove", mouseMove);
  });
}

/* ===================================
   11. 2048 PUZZLE
   =================================== */

function puzzle2048() {
  showGame(`
    <p>Arrow keys से टाइलें जोड़ो।</p>
    <h3 id="p2048Score">Score: 0</h3>
    <div id="p2048Board" class="p2048-board"></div>
    <button id="p2048Reset">Restart</button>
    <style>
      .p2048-board {
        display:grid;
        grid-template-columns:repeat(4,65px);
        gap:6px;
        background:#888;
        padding:8px;
        width:max-content;
        margin:12px auto;
      }
      .p2048-board div {
        width:65px;height:65px;
        display:flex;align-items:center;justify-content:center;
        background:#eee4da;color:#222;font-weight:bold;font-size:20px;
      }
    </style>
  `);

  const boardElement = document.getElementById("p2048Board");
  const scoreElement = document.getElementById("p2048Score");

  let board, score;

  function reset() {
    board = Array(16).fill(0);
    score = 0;
    addTile();
    addTile();
    render();
  }

  function addTile() {
    const empty = board.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0);
    if (!empty.length) return;
    const index = empty[Math.floor(Math.random() * empty.length)];
    board[index] = Math.random() < 0.9 ? 2 : 4;
  }

  function render() {
    boardElement.innerHTML = "";

    board.forEach(value => {
      const cell = document.createElement("div");
      cell.textContent = value || "";
      cell.style.background = value ? "#f0c078" : "#ddd";
      boardElement.appendChild(cell);
    });

    scoreElement.textContent = `Score: ${score}`;
  }

  function merge(line) {
    const values = line.filter(Boolean);

    for (let i = 0; i < values.length - 1; i++) {
      if (values[i] === values[i + 1]) {
        values[i] *= 2;
        score += values[i];
        values.splice(i + 1, 1);
      }
    }

    while (values.length < 4) values.push(0);
    return values;
  }

  function move(direction) {
    const old = board.join(",");

    for (let i = 0; i < 4; i++) {
      let indexes;

      if (direction === "left" || direction === "right") {
        indexes = [0, 1, 2, 3].map(col => i * 4 + col);
      } else {
        indexes = [0, 1, 2, 3].map(row => row * 4 + i);
      }

      let line = indexes.map(index => board[index]);

      if (direction === "right" || direction === "down") line.reverse();

      line = merge(line);

      if (direction === "right" || direction === "down") line.reverse();

      indexes.forEach((index, j) => board[index] = line[j]);
    }

    if (old !== board.join(",")) {
      addTile();
      render();
    }
  }

  function keyHandler(event) {
    const directions = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowUp: "up",
      ArrowDown: "down"
    };

    if (!directions[event.key]) return;

    event.preventDefault();
    move(directions[event.key]);
  }

  document.addEventListener("keydown", keyHandler);
  document.getElementById("p2048Reset").onclick = reset;

  setCleanup(() => document.removeEventListener("keydown", keyHandler));
  reset();
}

/* ===================================
   12. MINESWEEPER
   =================================== */

function minesweeper() {
  showGame(`
    <p>बम से बचो!</p>
    <div id="mineBoard" class="mine-board"></div>
    <p id="mineStatus">सुरक्षित खाने खोजो।</p>
    <button id="mineReset">Restart</button>
    <style>
      .mine-board {
        display:grid;
        grid-template-columns:repeat(8,35px);
        gap:3px;
        justify-content:center;
      }
      .mine-board button {height:35px;}
    </style>
  `);

  const boardElement = document.getElementById("mineBoard");
  const status = document.getElementById("mineStatus");

  let data, revealed, ended;

  function reset() {
    data = Array(64).fill(0);
    revealed = Array(64).fill(false);
    ended = false;

    let placed = 0;

    while (placed < 10) {
      const index = Math.floor(Math.random() * 64);

      if (data[index] !== -1) {
        data[index] = -1;
        placed++;
      }
    }

    for (let i = 0; i < 64; i++) {
      if (data[i] === -1) continue;

      const row = Math.floor(i / 8);
      const col = i % 8;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = row + dr;
          const c = col + dc;

          if (r >= 0 && r < 8 && c >= 0 && c < 8 &&
              data[r * 8 + c] === -1) {
            data[i]++;
          }
        }
      }
    }

    status.textContent = "सुरक्षित खाने खोजो।";
    render();
  }

  function render() {
    boardElement.innerHTML = "";

    data.forEach((value, index) => {
      const button = document.createElement("button");
      button.textContent = revealed[index]
        ? (value === -1 ? "💣" : (value || ""))
        : "";

      button.disabled = revealed[index] || ended;

      button.onclick = () => {
        if (ended || revealed[index]) return;

        revealed[index] = true;

        if (data[index] === -1) {
          ended = true;
          status.textContent = "💥 Game Over!";
        } else if (revealed.filter(Boolean).length === 54) {
          ended = true;
          status.textContent = "You Win! 🎉";
        } else {
          status.textContent = "सुरक्षित! आगे बढ़ो।";
        }

        render();
      };

      boardElement.appendChild(button);
    });
  }

  document.getElementById("mineReset").onclick = reset;
  reset();
}

/* ===================================
   13. WHACK-A-MOLE
   =================================== */

function whackAMole() {
  showGame(`
    <h3 id="moleScore">Score: 0</h3>
    <div id="moleBoard" class="mole-board"></div>
    <button id="moleStart">Start / Restart</button>
    <style>
      .mole-board {
        display:grid;
        grid-template-columns:repeat(3,70px);
        gap:8px;
        justify-content:center;
      }
      .mole-board button {height:65px;font-size:26px;}
    </style>
  `);

  const board = document.getElementById("moleBoard");
  const scoreText = document.getElementById("moleScore");

  let score = 0, active = -1, interval, timeout, running = false;

  function render() {
    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
      const button = document.createElement("button");
      button.textContent = active === i ? "🐹" : "🕳️";

      button.onclick = () => {
        if (running && active === i) {
          score++;
          scoreText.textContent = `Score: ${score}`;
          active = -1;
          render();
        }
      };

      board.appendChild(button);
    }
  }

  function start() {
    clearInterval(interval);
    clearTimeout(timeout);

    score = 0;
    running = true;
    active = -1;
    scoreText.textContent = "Score: 0";
    render();

    interval = setInterval(() => {
      active = Math.floor(Math.random() * 9);
      render();
    }, 700);

    timeout = setTimeout(() => {
      running = false;
      active = -1;
      clearInterval(interval);
      render();
      scoreText.textContent = `Time Up! Score: ${score}`;
    }, 20000);
  }

  document.getElementById("moleStart").onclick = start;

  setCleanup(() => {
    clearInterval(interval);
    clearTimeout(timeout);
  });

  render();
}

/* ===================================
   14. SIMON MEMORY
   =================================== */

function simonMemory() {
  showGame(`
    <h3 id="simonStatus">Start दबाओ</h3>
    <div id="simonBoard" class="simon-board">
      <button data-color="0" style="background:#e44">Red</button>
      <button data-color="1" style="background:#4b5">Green</button>
      <button data-color="2" style="background:#48e">Blue</button>
      <button data-color="3" style="background:#ec4">Yellow</button>
    </div>
    <button id="simonStart">Start / Restart</button>
    <style>
      .simon-board {
        display:grid;
        grid-template-columns:100px 100px;
        gap:8px;
        justify-content:center;
        margin:20px;
      }
      .simon-board button {
        height:85px;
        border:0;
        border-radius:12px;
        cursor:pointer;
      }
      .simon-board .active {
        outline:5px solid white;
        filter:brightness(1.4);
      }
    </style>
  `);

  const status = document.getElementById("simonStatus");
  const buttons = [...document.querySelectorAll("#simonBoard button")];

  let sequence = [], position = 0, accepting = false, timers = [];

  function later(callback, delay) {
    const timer = setTimeout(callback, delay);
    timers.push(timer);
  }

  function flash(index) {
    buttons[index].classList.add("active");
    later(() => buttons[index].classList.remove("active"), 300);
  }

  function playSequence() {
    accepting = false;
    status.textContent = "ध्यान से देखो!";

    sequence.forEach((value, i) => {
      later(() => flash(value), 500 + i * 650);
    });

    later(() => {
      position = 0;
      accepting = true;
      status.textContent = `तुम्हारी बारी! Level ${sequence.length}`;
    }, 500 + sequence.length * 650);
  }

  function nextLevel() {
    sequence.push(Math.floor(Math.random() * 4));
    playSequence();
  }

  function start() {
    timers.forEach(clearTimeout);
    timers = [];
    sequence = [];
    position = 0;
    accepting = false;
    nextLevel();
  }

  buttons.forEach((button, index) => {
    button.onclick = () => {
      if (!accepting) return;

      flash(index);

      if (index !== sequence[position]) {
        accepting = false;
        status.textContent = "गलत! Start दबाकर फिर कोशिश करो।";
        return;
      }

      position++;

      if (position === sequence.length) {
        accepting = false;
        status.textContent = "सही! अगला Level...";
        later(nextLevel, 700);
      }
    };
  });

  document.getElementById("simonStart").onclick = start;
  setCleanup(() => timers.forEach(clearTimeout));
}

/* ===================================
   15. PLATFORM JUMPER
   =================================== */

function platformJumper() {
  showGame(`
    <p>Arrow keys से चलो और Space से कूदो।</p>
    <canvas id="platformCanvas" width="360" height="420"></canvas>
    <p id="platformStatus">Score: 0</p>
  `);

  const canvas = document.getElementById("platformCanvas");
  const ctx = canvas.getContext("2d");
  const status = document.getElementById("platformStatus");

  const keys = {};
  let player, platforms, score, running, timer;

  function reset() {
    player = { x: 160, y: 300, vy: 0 };
    platforms = [];

    for (let i = 0; i < 8; i++) {
      platforms.push({
        x: Math.random() * 290,
        y: 360 - i * 50,
        width: 70
      });
    }

    score = 0;
    running = true;
    clearInterval(timer);
    timer = setInterval(tick, 20);
  }

  function keyDown(event) {
    keys[event.key] = true;

    if (event.code === "Space" && player.vy === 0) {
      player.vy = -9;
    }
  }

  function keyUp(event) {
    keys[event.key] = false;
  }

  function tick() {
    if (!running) return;

    const oldY = player.y;

    if (keys.ArrowLeft) player.x -= 4;
    if (keys.ArrowRight) player.x += 4;

    player.x = (player.x + 360) % 360;

    player.vy += 0.35;
    player.y += player.vy;

    platforms.forEach(platform => {
      if (
        player.vy > 0 &&
        oldY + 20 <= platform.y &&
        player.y + 20 >= platform.y &&
        player.x + 20 > platform.x &&
        player.x < platform.x + platform.width
      ) {
        player.y = platform.y - 20;
        player.vy = -8;
        score++;
        status.textContent = `Score: ${score}`;
      }
    });

    if (player.y > 420) {
      running = false;
      status.textContent = `Game Over! Score: ${score}`;
    }

    ctx.fillStyle = "#c7edff";
    ctx.fillRect(0, 0, 360, 420);

    ctx.fillStyle = "#4b9";
    platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, 8));

    ctx.fillStyle = "#e44";
    ctx.fillRect(player.x, player.y, 20, 20);
  }

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  setCleanup(() => {
    clearInterval(timer);
    document.removeEventListener("keydown", keyDown);
    document.removeEventListener("keyup", keyUp);
  });

  reset();
}

/* ===================================
   END OF GAMEZONE SCRIPT
   =================================== */