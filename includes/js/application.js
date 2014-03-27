// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function () {
  new GameManager(9, KeyboardInputManager, LevelManager, angular.element($(".program-drawer")).scope());
});
