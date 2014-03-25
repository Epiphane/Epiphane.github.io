function GameManager(size, InputManager, ProgramDrawer) {
   var self = this;

   this.size         = size; // Size of the grid
   this.inputManager = new InputManager;

   this.inputManager.on("go", this.go.bind(this));

   this.setup();

   ProgramDrawer.programSelectedCallback = function(program) {
      self.grid.program = program;
   };
}

// Set up the game
GameManager.prototype.setup = function () {
   this.grid = new Grid(this.size);
};

GameManager.prototype.go = function() {
   this.grid.iterate();
}