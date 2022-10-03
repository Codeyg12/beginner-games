import Player from './player.js';
import InputHandler from './input.js';
import { drawStatus } from './utils.js';

window.addEventListener('load', function() {
    loading.style.display = 'none';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const player = new Player(canvas.width, canvas.height)
    const input = new InputHandler();
    
    // Line 15-18 are for adjusting the frame rate
    let lastTime = 0;
    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        player.update(input.lastKey)
        player.draw(ctx, deltaTime);
        drawStatus(ctx, input, player)
        requestAnimationFrame(animate)
    };
    animate(0);
})