const ctx = canvas.getContext("2d");
canvas.width = 700;
canvas.height = 700;

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
        console.log(this.keys)
      } // else if (e.key === "Enter" && gameOver) {
      //     restartGame();
      //   }
    });

    window.addEventListener("keyup", (e) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp"
      ) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
        console.log(this.keys)
      }
    });
  }
}

class Player {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.x = 0;
    this.y = 0;
    this.width = 20;
    this.height = 20;
    this.speedX = 0;
    this.speedY = 0;
  }

  update(input) {
    if (input.keys.indexOf("ArrowRight") > -1) {
      this.speedX = 3;
      this.speedY = 0
    } else if (input.keys.indexOf("ArrowLeft") > -1) {
      this.speedX = -3;
      this.speedY = 0
    } else if (input.keys.indexOf("ArrowUp") > -1) {
      this.speedY = -3;
      this.speedX = 0
    } else if (input.keys.indexOf("ArrowDown") > -1) {
      this.speedY = 3;
      this.speedX = 0
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
  }

  draw(context) {
    context.fillStyle = "white";
    context.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Enemy {
  constructor(gameWidth, gameHeight) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.x = Math.floor(Math.random() * gameWidth);
    this.y = Math.floor(Math.random() * gameHeight);
    this.width = 20;
    this.height = 20;
  }

  update() {

  }

  draw(context) {
    context.fillStyle = "white";
    context.fillRect(this.x, this.y, this.width, this.height);
  }

}

const input = new InputHandler();
const player = new Player(canvas.width, canvas.height);
const enemy = new Enemy(canvas.width, canvas.height)

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(animate);
  player.draw(ctx);
  player.update(input);
  enemy.draw(ctx)
}
animate();
