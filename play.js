
const params = new URLSearchParams(window.location.search);
const gameType = params.get("game");

const container = document.getElementById("game-container");
const title = document.getElementById("game-title");
const description = document.getElementById("game-description");
const message = document.getElementById("game-message");

function button(text, action) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.addEventListener("click", action);
  return btn;
}

function setMessage(text) {
  message.textContent = text;
}

// NUMBER GUESS
function numberGame() {
  title.textContent = "🔢 Number Guess";
  description.textContent = "Guess the secret number between 1 and 100!";
  let secret = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;

  container.innerHTML = `
    <h2>🤔 What's the number?</h2>
    <input id="guess" type="number" min="1" max="100" placeholder="Enter a number">
    <div id="guess-result"></div>
  `;

  container.appendChild(button("Guess!", () => {
    const input = document.getElementById("guess");
    const result = document.getElementById("guess-result");
    const guess = Number(input.value);

    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
      result.textContent = "Enter a number from 1 to 100!";
      return;
    }

    attempts++;

    if (guess === secret) {
      result.textContent = `🎉 YOU WON! It took ${attempts} guesses!`;
      setMessage("Amazing job!");
    } else {
      result.textContent = guess < secret ? "⬆️ Too low! Try higher." : "⬇️ Too high! Try lower.";
    }
  }));

  container.appendChild(button("Restart", numberGame));
}

// CLICK CHALLENGE
function clickGame() {
  title.textContent = "⚡ Click Challenge";
  description.textContent = "Click as many times as possible in 10 seconds!";

  let clicks = 0;
  let running = false;
  let ended = false;

  container.innerHTML = `
    <h2 id="click-count">Clicks: 0</h2>
    <h2 id="click-time">Time: 10</h2>
    <div id="click-zone"></div>
  `;

  const zone = document.getElementById("click-zone");

  const start = button("START GAME", () => {
    if (running || ended) return;
    running = true;
    start.disabled = true;

    const play = button("CLICK ME! ⚡", () => {
      if (!running) return;
      clicks++;
      document.getElementById("click-count").textContent = "Clicks: " + clicks;
    });

    zone.appendChild(play);

    let time = 10;
    const timer = setInterval(() => {
      time--;
      document.getElementById("click-time").textContent = "Time: " + time;

      if (time <= 0) {
        clearInterval(timer);
        running = false;
        ended = true;
        play.disabled = true;
        setMessage("🏆 You scored " + clicks + " clicks!");
        zone.appendChild(button("Play Again", clickGame));
      }
    }, 1000);
  });

  container.appendChild(start);
}

// ROCK PAPER SCISSORS
function rpsGame() {
  title.textContent = "✊ Rock Paper Scissors";
  description.textContent = "Can you beat the computer?";

  container.innerHTML = "<h2>Choose your move!</h2>";

  const choices = ["Rock", "Paper", "Scissors"];

  choices.forEach(choice => {
    container.appendChild(button(choice, () => {
      const computer = choices[Math.floor(Math.random() * 3)];

      let result = "";

      if (choice === computer) {
        result = "🤝 It's a tie!";
      } else if (
        (choice === "Rock" && computer === "Scissors") ||
        (choice === "Paper" && computer === "Rock") ||
        (choice === "Scissors" && computer === "Paper")
      ) {
        result = "🎉 YOU WIN!";
      } else {
        result = "😢 Computer wins!";
      }

      setMessage(`You: ${choice} | Computer: ${computer} | ${result}`);
    }));
  });

  container.appendChild(button("Restart", rpsGame));
}

// MEMORY MATCH
function memoryGame() {
  title.textContent = "🧠 Memory Match";
  description.textContent = "Find all matching pairs!";

  const symbols = ["🍎", "🍌", "🍇", "🍒", "🍋", "🍉"];
  const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

  let first = null;
  let second = null;
  let locked = false;
  let matched = 0;

  container.innerHTML = `
    <div id="memory-grid" style="
      display:grid;
      grid-template-columns:repeat(4,1fr);
      gap:10px;
    "></div>
  `;

  const grid = document.getElementById("memory-grid");

  cards.forEach((symbol, index) => {
    const card = button("❔", () => {
      if (locked || card.disabled || card === first) return;

      card.textContent = symbol;
      card.disabled = true;

      if (!first) {
        first = card;
        return;
      }

      second = card;
      locked = true;

      if (first.textContent === second.textContent) {
        matched += 2;
        first = null;
        second = null;
        locked = false;

        if (matched === cards.length) {
          setMessage("🏆 YOU FOUND EVERY PAIR!");
        }
      } else {
        setTimeout(() => {
          first.textContent = "❔";
          second.textContent = "❔";
          first.disabled = false;
          second.disabled = false;
          first = null;
          second = null;
          locked = false;
        }, 800);
      }
    });

    card.style.fontSize = "24px";
    card.style.padding = "18px 5px";
    card.dataset.index = index;
    grid.appendChild(card);
  });

  container.appendChild(button("Restart", memoryGame));
}

// REACTION TEST
function reactionGame() {
  title.textContent = "🎯 Reaction Test";
  description.textContent = "Wait for green, then click as fast as possible!";

  let startTime;
  let ready = false;
  let timer;

  container.innerHTML = `
    <h2 id="reaction-zone">Press START to begin!</h2>
  `;

  const zone = document.getElementById("reaction-zone");

  container.appendChild(button("START", () => {
    clearTimeout(timer);
    ready = false;
    zone.textContent = "Wait for GREEN... 🟡";
    zone.style.color = "orange";

    const delay = 1500 + Math.random() * 3500;

    timer = setTimeout(() => {
      ready = true;
      startTime = performance.now();
      zone.textContent = "CLICK NOW! 🟢";
      zone.style.color = "lime";
    }, delay);
  }));

  container.appendChild(button("CLICK!", () => {
    if (!ready) {
      setMessage("Too early! Wait for green.");
      return;
    }

    const reaction = Math.round(performance.now() - startTime);
    ready = false;
    clearTimeout(timer);
    zone.textContent = "Your reaction: " + reaction + "ms";
    zone.style.color = "white";
    setMessage("⚡ Great reaction!");
  }));
}

// TIC TAC TOE
function ticTacToe() {
  title.textContent = "❌ Tic Tac Toe";
  description.textContent = "Player X vs Player O. Get three in a row!";

  let board = Array(9).fill("");
  let turn = "X";
  let finished = false;

  container.innerHTML = `
    <h2 id="tic-status">Player X's turn</h2>
    <div id="tic-grid" style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:8px;
      max-width:300px;
      margin:20px auto;
    "></div>
  `;

  const grid = document.getElementById("tic-grid");
  const status = document.getElementById("tic-status");

  const wins = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  function checkWinner() {
    return wins.some(combo =>
      combo.every(index => board[index] === turn)
    );
  }

  board.forEach((_, index) => {
    grid.appendChild(button("", () => {
      if (board[index] || finished) return;

      board[index] = turn;
      const cell = grid.children[index];
      cell.textContent = turn;

      if (checkWinner()) {
        status.textContent = "🏆 Player " + turn + " wins!";
        finished = true;
      } else if (board.every(Boolean)) {
        status.textContent = "🤝 It's a draw!";
        finished = true;
      } else {
        turn = turn === "X" ? "O" : "X";
        status.textContent = "Player " + turn + "'s turn";
      }
    }));
  });

  container.appendChild(button("Restart", ticTacToe));
}

// GAME LOADER
const gameFunctions = {
  number: numberGame,
  clicker: clickGame,
  rps: rpsGame,
  memory: memoryGame,
  reaction: reactionGame,
  tictactoe: ticTacToe
};

if (gameFunctions[gameType]) {
  gameFunctions[gameType]();
} else {
  title.textContent = "Game Not Found";
  description.textContent = "Please return to the GameVerse library.";
  container.innerHTML = '<a href="index.html">Return to Games</a>';
}
