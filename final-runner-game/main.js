import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener("load", function () {
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 3;
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHandler(this);
      this.UI = new UI(this);
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = true;
      this.maxParticles = 100;
      this.score = 0;
      this.fontColor = "black";
      this.time = 20000;
      this.maxTime = 0;
      this.gameOver = false;
      this.lives = 5;
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
    }

    update(deltaTime) {
      this.time -= deltaTime;
      if (this.time <= this.maxTime) {
        this.gameOver = true;
      }
      this.background.update();
      this.player.update(this.input.keys, deltaTime);

      // Handle enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemy();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += deltaTime;
      }

      // Triggers update for enemies
      this.enemies.forEach((enemy) => {
        enemy.update(deltaTime);
      });

      // Handle flaoting messages
      this.floatingMessages.forEach((message) => {
        message.update();
      });

      // Handle of particles
      this.particles.forEach((particle, index) => {
        particle.update();
      });

      if (this.particles.length > this.maxParticles) {
        this.particles.length = this.maxParticles;
      }

      // Handle collosions
      this.collisions.forEach((collision, index) => {
        collision.update(deltaTime);
      });

      this.enemies = this.enemies.filter(
        (message) => !message.markedForDeletion
      );
      this.particles = this.particles.filter(
        (message) => !message.markedForDeletion
      );
      this.collisions = this.collisions.filter(
        (message) => !message.markedForDeletion
      );
      this.floatingMessages = this.floatingMessages.filter(
        (message) => !message.markedForDeletion
      );
    }

    draw(context) {
      this.background.draw(context);
      this.player.draw(context);

      this.enemies.forEach((enemy) => {
        enemy.draw(context);
      });

      this.particles.forEach((particle) => {
        particle.draw(context);
      });

      this.collisions.forEach((collision) => {
        collision.draw(context);
      });

      this.floatingMessages.forEach((message) => {
        message.draw(context);
      });

      this.UI.draw(context);
    }

    addEnemy() {
      if (this.speed > 0 && Math.random() < 0.5) {
        this.enemies.push(new GroundEnemy(this));
      } else if (this.speed > 0) {
        this.enemies.push(new ClimbingEnemy(this));
      }
      this.enemies.push(new FlyingEnemy(this));
      console.log(this.particles);
    }
  }

  const game = new Game(canvas.width, canvas.height);

  let lastTime = 0;
  function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    if (!game.gameOver) {
      requestAnimationFrame(animate);
    }
  }

  animate(0);
});
