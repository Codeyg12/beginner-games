/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
const explosions = [];
// Makes so the click lands where clicked with compensating for canvas
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
  constructor(x, y) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = "boom.png";
    this.frame = 0;
    this.timer = 0;
    this.angle = Math.random() * 6.2;
    this.sound = new Audio();
    this.sound.src = "ice.wav";
  }

  update() {
    // The sound only plays on the first frame
    if (this.frame === 0) {
      this.sound.play();
    }
    // Counts up on the timer until all frames have been used
    this.timer++;
    if (this.timer % 10 === 0) {
      this.frame++;
    }
  }

  draw() {
    // Save and restore are used so other elements arent effected
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.width / 2,
      0 - this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}

window.addEventListener("click", function (e) {
  createAnimation(e);
});
// window.addEventListener('mousemove', function(e) {
//     createAnimation(e)
// })

function createAnimation(e) {
  // Creates the animation using the event, "e", where the pointer was
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;
  explosions.push(new Explosion(positionX, positionY));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();
    // Checks the animation has gone through and then removes the explosion from the array
    if (explosions[i].frame > 5) {
      explosions.splice(i, 1);
      i--;
    }
  }
  requestAnimationFrame(animate);
}
animate();
