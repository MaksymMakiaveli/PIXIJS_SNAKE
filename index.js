const wrapper = document.querySelector('.wrapper'),
  startButton = document.querySelector('#start'),
  restartButton = document.querySelector('#restart'),
  stopButton = document.querySelector('#stop'),
  buttonLevel = document.querySelectorAll('.button-level'),
  text = document.querySelector('.text');

startButton.disabled = true;
stopButton.disabled = true;
restartButton.disabled = true;

const app = new PIXI.Application({
  width: 608,
  height: 608,
  antialiasing: true,
  resolution: 1,
  backgroundAlpha: 0,
});
wrapper.appendChild(app.view);
const loader = new PIXI.Loader();
loader.add('atlas', 'assets/atlas.json').load(setup);

const cells = 32;
let count = 0;
const snake = {
  x: 8 * cells,
  y: 10 * cells,
  dx: cells,
  dy: 0,
  tails: [
    { x: 8 * cells, y: 10 * cells },
    { x: 7 * cells, y: 10 * cells },
    { x: 6 * cells, y: 10 * cells },
  ],
  maxTails: 3,
};

let carrotCoord = {
  x: randomX(),
  y: randomY(),
};

let gameScene, dungeon, atlas, carrot, snakeImg, levelGame, container, textScore;
let score = 0;
let startBoolean = false;

function setup() {
  snake.tails.forEach((el) => {
    if (el.x === carrotCoord.x && el.y === carrotCoord.y) {
      carrotCoord = {
        x: randomX(),
        y: randomY(),
      };
    }
  });
  if (startBoolean) {
    requestAnimationFrame(setup);
    if (++count < levelGame) {
      return;
    }
    count = 0;
  }
  if (carrotCoord.x === snake.x && carrotCoord.y === snake.y) {
    refreshGame();
  }
  // Game Area
  container = new PIXI.Container();
  app.stage.addChild(container);

  atlas = loader.resources['atlas'].textures;

  // Draw Area game snake
  dungeon = new PIXI.Sprite(atlas['area.png']);
  container.addChild(dungeon);
  snake.x += snake.dx;
  snake.y += snake.dy;
  // Draw Text Score
  let textScore = new PIXI.Text(score, { fontFamily: 'Arial', fontSize: 24, fill: 0xffffff });
  textScore.x = app.view.width / 2;
  textScore.y = 20;
  container.addChild(textScore);
  // Draw Carrot
  carrot = new PIXI.Sprite(atlas['carrot.png']);
  carrot.width = cells;
  carrot.height = cells;
  carrot.x = carrotCoord.x;
  carrot.y = carrotCoord.y;
  container.addChild(carrot);

  collision();

  snake.tails.unshift({ x: snake.x, y: snake.y });

  if (snake.tails.length > snake.maxTails) {
    snake.tails.pop();
  }

  snake.tails.forEach((cell, index) => {
    drawSnake(cell.x, cell.y, cells, cells);

    if (cell.x === carrot.x && cell.y === carrot.y && index == 0) {
      snake.maxTails++;
      snake.maxTails++;
      snake.maxTails++;
      snake.maxTails++;

      carrotCoord.x = Math.floor(Math.random() * 17 + 1) * cells;
      carrotCoord.y = Math.floor(Math.random() * 15 + 3) * cells;
      score++;
    }

    for (let i = index + 1; i < snake.tails.length; i++) {
      if (cell.x === snake.tails[i].x && cell.y === snake.tails[i].y) {
        refreshGame();
      }
    }
  });
}
function drawSnake(x, y, width, height) {
  snakeImg = new PIXI.Sprite(atlas['snake2.png']);
  snakeImg.width = width;
  snakeImg.height = height;
  snakeImg.x = x;
  snakeImg.y = y;
  container.addChild(snakeImg);
}

function collision() {
  if (
    snake.x < 0 + cells ||
    snake.x >= dungeon.width - cells ||
    snake.y < 0 + cells * 3 ||
    snake.y >= dungeon.height - cells
  ) {
    refreshGame();
  }
}

function refreshGame() {
  app.renderer.clear(gameScene);
  startBoolean = false;
  snake.x = 8 * cells;
  snake.y = 10 * cells;
  snake.tails = [
    { x: 8 * cells, y: 10 * cells },
    { x: 7 * cells, y: 10 * cells },
    { x: 6 * cells, y: 10 * cells },
  ];
  snake.maxTails = 3;
  snake.dx = cells;
  snake.dy = 0;
  score = 0;

  carrotCoord.x = randomX();
  carrotCoord.y = randomY();
}

function randomX() {
  return Math.floor(Math.random() * 17 + 1) * cells;
}
function randomY() {
  return Math.floor(Math.random() * 15 + 3) * cells;
}

startButton.addEventListener('click', (e) => {
  startBoolean = true;
  setup();
});
stopButton.addEventListener('click', (e) => {
  startBoolean = false;
});
restartButton.addEventListener('click', (e) => {
  startBoolean = false;
  refreshGame();
  setup();
});

window.addEventListener('keydown', direction);

buttonLevel.forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    if (btn.id === 'junior') {
      levelGame = 8;
      text.innerHTML = 'junior';
      text.style.color = '#15d1d8';
    }
    if (btn.id === 'middle') {
      levelGame = 5;
      text.innerHTML = 'middle';
      text.style.color = '#e1f00e';
    }
    if (btn.id === 'senior') {
      levelGame = 2;
      text.innerHTML = 'senior';
      text.style.color = '#e90f0f';
    }

    startButton.disabled = false;
    stopButton.disabled = false;
    restartButton.disabled = false;
  });
});

function direction(e) {
  // press W
  if (e.keyCode === 87 && snake.dy === 0) {
    snake.dy = -cells;
    snake.dx = 0;
  }
  // press A
  if (e.keyCode === 65 && snake.dx === 0) {
    snake.dx = -cells;
    snake.dy = 0;
  }
  //press D
  if (e.keyCode === 68 && snake.dx === 0) {
    snake.dx = cells;
    snake.dy = 0;
  }
  // press S
  if (e.keyCode === 83 && snake.dy === 0) {
    snake.dy = cells;
    snake.dx = 0;
  }
}
