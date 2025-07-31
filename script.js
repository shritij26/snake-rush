const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score-display");
const gameOverDisplay = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");

const GRID_SIZE = 20;
let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
let direction = { x: 1, y: 0 };
let food = [];
let score = 0;
let interval;

const eatSound = new Audio("music/eat.mp3");
const turnSound = new Audio("music/turn.mp3");
const gameOverSound = new Audio("music/wrong.mp3");
const startSound = new Audio("music/start.wav");

eatSound.load();
turnSound.load();
gameOverSound.load();
startSound.load();

document.getElementById("start-button").addEventListener("click", startGame);
document.querySelector(".arrow.up").onclick = () => changeDirection(0, -1);
document.querySelector(".arrow.down").onclick = () => changeDirection(0, 1);
document.querySelector(".arrow.left").onclick = () => changeDirection(-1, 0);
document.querySelector(".arrow.right").onclick = () => changeDirection(1, 0);

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") changeDirection(0, -1);
  else if (e.key === "ArrowDown" || e.key === "s") changeDirection(0, 1);
  else if (e.key === "ArrowLeft" || e.key === "a") changeDirection(-1, 0);
  else if (e.key === "ArrowRight" || e.key === "d") changeDirection(1, 0);
});

function startGame() {
  startSound.play();
  snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }];
  direction = { x: 1, y: 0 };
  score = 0;
  updateScore();
  placeFood();
  clearInterval(interval);
  interval = setInterval(update, 100);
  gameOverDisplay.classList.add("hidden");
  render();
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (isCollision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  let ate = false;
  for (let i = 0; i < food.length; i++) {
    if (head.x === food[i].x && head.y === food[i].y) {
      food.splice(i, 1);
      eatSound.play();
      score++;
      updateScore();
      placeFood();
      ate = true;
      break;
    }
  }

  if (!ate) {
    snake.pop();
  }


  render();
}

function render() {
  board.innerHTML = '<div class="grid-overlay"></div>';

  snake.forEach((segment, index) => {
    const el = document.createElement("div");
    el.style.gridColumnStart = segment.x;
    el.style.gridRowStart = segment.y;
    el.className = index === 0 ? "snake-head" : "snake";
    board.appendChild(el);
  });

  food.forEach(f => {
    const foodEl = document.createElement("div");
    foodEl.style.gridColumnStart = f.x;
    foodEl.style.gridRowStart = f.y;
    foodEl.className = "food";
    board.appendChild(foodEl);
  });
}

function placeFood() {
  while (food.length < 2) {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE) + 1,
      y: Math.floor(Math.random() * GRID_SIZE) + 1,
    };
    // Ensure no overlap with snake or existing food
    const overlapWithSnake = snake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
    const overlapWithFood = food.some(f => f.x === newFood.x && f.y === newFood.y);
    if (!overlapWithSnake && !overlapWithFood) {
      food.push(newFood);
    }
  }
}

function changeDirection(x, y) {
  if (x === -direction.x || y === -direction.y) return;
  direction = { x, y };
  turnSound.play();
}

function isCollision(pos) {
  return (
    pos.x < 1 || pos.x > GRID_SIZE ||
    pos.y < 1 || pos.y > GRID_SIZE ||
    snake.some(seg => seg.x === pos.x && seg.y === pos.y)
  );
}

function updateScore() {
  scoreDisplay.textContent = "Score: " + score;
}

function endGame() {
  gameOverSound.play();
  clearInterval(interval);
  finalScore.textContent = "Score: " + score;
  gameOverDisplay.classList.remove("hidden");
}

function restartGame() {
  startGame();
}




