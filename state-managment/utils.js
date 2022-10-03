// Used to show the most recent input as well as the current state
export function drawStatus(context, input, player) {
    context.font = '30px Helvetica';
    context.fillText('Last input: ' + input.lastKey, 20, 50);
    context.fillText('Active State: ' + player.currentState.state, 20, 90)
}