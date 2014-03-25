// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(14, KeyboardInputManager, angular.element($(".program-drawer")).scope());
});
