const ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;
let gameOver = false;
let colors = [
  'white',
  'blue',
  'red',
  'purple',
  'green',
  'gray',
  'violet'
]
let color = colors[Math.floor(Math.random() * colors.length)]

class InputHandler {
  constructor() {
    this.keys = [];
    window.addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowDown" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "ArrowUp") &&
        this.keys.indexOf(e.key) === -1
      ) {
        this.keys.push(e.key);
        console.log(this.keys);
      } else if (e.key === "Enter" && gameOver) {
        restartGame();
      }
    });

    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp"
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
        console.log(this.keys);
      }
    });
  }
}

class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.x = 1;
    this.y = 1;
    this.width = 20;
    this.height = 20;
    this.speedX = 3;
    this.speedY = 0;
  }

  update(input) {
    if (input.keys.indexOf("ArrowRight") > -1) {
      this.speedX = 3;
      this.speedY = 0;
    } else if (input.keys.indexOf("ArrowLeft") > -1) {
      this.speedX = -3;
      this.speedY = 0;
    } else if (input.keys.indexOf("ArrowUp") > -1) {
      this.speedY = -3;
      this.speedX = 0;
    } else if (input.keys.indexOf("ArrowDown") > -1) {
      this.speedY = 3;
      this.speedX = 0;
    }

    // Horizontal
    this.x += this.speedX;
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.gameWidth - this.width) {
      this.x = this.gameWidth - this.width;
    }

    // Vertical
    this.y += this.speedY;
    if (this.y < 0) {
      this.y = 0;
    } else if (this.y > this.gameHeight - this.height) {
      this.y = this.gameHeight - this.height;
    }

    // Collision detection
    if (
      this.x >= this.gameWidth - this.width ||
      this.x <= 0 ||
      this.y >= this.gameHeight - this.height ||
      this.y <= 0
    ) {
      gameOver = true;
    }
  }

  draw(context) {
    context.fillStyle = "white";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  reset() {   
    this.x = 1;
    this.y = 1;
  }
}

class Food {
  constructor(gameWidth, gameHeight, color) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.width = 15;
    this.height = 15;
    this.x = Math.floor(Math.random() * this.gameWidth - this.width);
    this.y = Math.floor(Math.random() * this.gameHeight - this.height);
    this.color = color
  }

  update() {}

  draw(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  reset() {
    this.x = Math.floor(Math.random() * this.gameWidth - this.width);
    this.y = Math.floor(Math.random() * this.gameHeight - this.height);
  }

}

function restartGame() {
  player.reset();
  food.reset();
  gameOver = false;
  animate();
}

function gameStatus(context) {
  if (gameOver) {
    context.textAlign = "center";
    context.font = "40px Helvetica";
    context.fillStyle = "white";
    context.fillText("GAME OVER!", canvas.width / 2, 200);
  }
}

const input = new InputHandler();
const player = new Player(canvas.width, canvas.height);
const food = new Food(canvas.width, canvas.height, color);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  player.update(input);
  food.draw(ctx);
  gameStatus(ctx);
  if (!gameOver) {
    requestAnimationFrame(animate);
  }
}
animate();
