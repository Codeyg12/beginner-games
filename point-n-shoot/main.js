/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let score = 0;
let gameOver = false;
ctx.font = "50px Impact";

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

let ravens = [];
class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = "assets/raven.png";
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
  }

  update(deltaTime) {
    // Checks if the bird hits the top or bottom then switches direction
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }
    this.x -= this.directionX;
    this.y += this.directionY;

    //Deletes the bird if it crosses the screen
    if (this.x < 0 - this.width) {
      this.markedForDeletion = true;
    }

    this.timeSinceFlap += deltaTime;

    // Cycles through the bird image
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) {
        this.frame = 0;
      } else {
        this.frame++;
      }
      this.timeSinceFlap = 0;
    }

    // Checks if the bird has crossed the screen and ends game if it has
    if (this.x < 0 - this.width) {
      gameOver = true;
    }
  }

  draw() {
    // Adds the hidden hitbox
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let explosions = [];
class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "assets/boom.png";
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "assets/ice.wav";
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    // Plays the sound if its the first frame
    if (this.frame === 0) {
      this.sound.play();
    }

    this.timeSinceLastFrame += deltaTime;

    // Deletes the frame if its used all images
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) {
        this.markedForDeletion = true;
      }
    }
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y - this.size / 4,
      this.size,
      this.size
    );
  }
}

function drawScore() {
  // Draws the score, using both adds a shadow effect
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 50, 75);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 55, 80);
}

function drawGameOver() {
  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.fillText(
    "GAME OVER, your score is " + score + '! To restart press Enter',
    canvas.width / 2,
    canvas.height / 2
  );
  ctx.fillStyle = "white";
  ctx.fillText(
    "GAME OVER, your score is " + score + '! To restart press Enter',
    canvas.width / 2 + 5,
    canvas.height / 2 + 5
  );
}

function restartGame() {
  ravens = [];
  score = 0;
  gameOver = false;
  animate(0);
}

window.addEventListener('keydown', e => {
  if (e.key === 'Enter' && gameOver) {
    restartGame();
  }
})

// Checks the click to see if user has hit a bird
window.addEventListener("click", function (e) {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
  const pc = detectPixelColor.data;
  // Checks if the hidden colored hitbox matches all 3 color values
  ravens.forEach((bird) => {
    if (
      bird.randomColors[0] === pc[0] &&
      bird.randomColors[1] === pc[1] &&
      bird.randomColors[2] === pc[2]
    ) {
      // If all match the bird is deleted and score increases
      bird.markedForDeletion = true;
      score++;
      // Creates an explosion for each bird hit
      explosions.push(new Explosion(bird.x, bird.y, bird.width));
    }
  });
});

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;

  // Adds a new raven if the interval has passed
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    // Used to sort the ravens so bigger ones appear on top
    ravens.sort(function (a, b) {
      return a.width - b.width;
    });
  }

  drawScore();

  // Drys out code by combining spread op and foreach
  [...ravens, ...explosions].forEach((bird) => bird.update(deltaTime));
  [...ravens, ...explosions].forEach((bird) => bird.draw());

  // Filters out the birds/explosions so they leave the screen
  ravens = ravens.filter((bird) => !bird.markedForDeletion);
  explosions = explosions.filter((explode) => !explode.markedForDeletion);

  // Checks if the user has lost the game
  if (!gameOver) {
    requestAnimationFrame(animate);
  } else {
    drawGameOver();
  }
}
animate(0);
