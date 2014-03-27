var grid;

function GameManager(size, InputManager, ProgramDrawer) {
   var self = this;

   this.size         = size; // Size of the grid
   this.inputManager = new InputManager;

   this.inputManager.on("runProgram", this.runProgram.bind(this));
   this.inputManager.on("pause", this.pause.bind(this));
   this.shooterGrid = null;

   this.setup();

   ProgramDrawer.programSelectedCallback = function(program) {
      self.grid.program = program;
   };
}

// Set up the game
GameManager.prototype.setup = function () {
   this.grid = new Grid(this.size);
};

GameManager.prototype.runProgram = function() {
   var self = this;

   this.grid.runProgram(250, function() {
      self.startShooter(self.grid.programAttributes());
   });
}

GameManager.prototype.startShooter = function(attrs) {
   this.shooterGrid = new GameGrid(52, 21, this, attrs);

   this.shooterGrid.update(this.inputManager.keys)
}

GameManager.prototype.startProgrammer = function() {
   this.shooterGrid = null;
   this.grid.appear();
}

GameManager.prototype.move = function(direction) {
   if(this.shooterGrid) {
      this.shooterGrid.move(this.getVector(direction))
   }
}

GameManager.prototype.pause = function() {
   if(this.shooterGrid) {
      this.shooterGrid.pause()
   }
}

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
   // Vectors representing tile movement
   var map = {
      0: { x: 0,  y: -1 }, // Up
      1: { x: 1,  y: 0 },  // Right
      2: { x: 0,  y: 1 },  // Down
      3: { x: -1, y: 0 }   // Left
   };

   return map[direction];
};