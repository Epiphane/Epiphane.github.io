var grid;

function GameManager(size, InputManager, LevelManager, ProgramDrawer) {
   var self = this;

   this.programs = [
      {id: 2, name: 'Sp.read', description: 'Bullet Spread', selected: false, required: 5,
         map: [[0, 1, 0],
            [0, 0, 1],
            [1, 1, 1]]},
      {id: 3, name: 'Gl.ue', description: 'Slower Enemies', selected: false, required: 6,
         map: [[0, 1, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 1, 0]]}];

   this.availablePrograms = [
      {id: 0, name: 'Rend.er', description: 'Visibility', selected: false, required: 8,
         map: [[0, 0, 1, 1],
            [0, 0, 1, 1],
            [1, 1, 0, 0],
            [1, 1, 0, 0]]},
      {id: 1, name: 'Tim.er', description: 'Realtime Movement', selected: false, required: 3,
         map: [[0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]]}];

   this.size         = size; // Size of the grid
   this.inputManager = new InputManager;

   this.levels = new LevelManager;

   this.inputManager.on("runProgram", this.runProgram.bind(this));
   this.inputManager.on("pause", this.pause.bind(this));
   this.shooterGrid = null;

   this.setup();

   this.programDrawer = ProgramDrawer;
   this.programDrawer.programSelectedCallback = function(program) {
      self.grid.program = program;
   };

   this.programDrawer.programs = this.availablePrograms;
   this.programDrawer.$apply();
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
   $(".game-container").animate({"height": "292px"})
   this.shooterGrid = new GameGrid(52, 21, this, attrs, this.inputManager.keys, this.levels.getCurrentLevel());
}

GameManager.prototype.wonLevel = function() {
   this.levels.currentLevel++;
   if(this.programs.length > 0)
      this.availablePrograms.push(this.programs.shift())
   this.programDrawer.$apply();
   this.startProgrammer();
   if(this.levels.currentLevel == this.levels.levels.length)
      this.wonGame()
}

GameManager.prototype.wonGame = function() {
   $(".game-message").fadeIn()
   $(".see-program-button").click(function() {
      $(".game-message").fadeOut()
      $(".program-drawer").hide();
      $(".game-container").animate({"width": "491px"})
   })
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