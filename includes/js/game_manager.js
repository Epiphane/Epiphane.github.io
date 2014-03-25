var grid;

function GameManager(size, InputManager, ProgramDrawer) {
   var self = this;

   this.size         = size; // Size of the grid
   this.inputManager = new InputManager;

   this.inputManager.on("runProgram", this.runProgram.bind(this));

   this.setup();

   ProgramDrawer.programSelectedCallback = function(program) {
      self.grid.program = program;
   };

   grid = self.grid;
}

// Set up the game
GameManager.prototype.setup = function () {
   this.grid = new Grid(this.size);
};

GameManager.prototype.runProgram = function() {
   this.grid.runProgram(250);
}