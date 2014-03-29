function GameManager(size, InputManager, LevelManager, ProgramDrawer) {
   var self = this;

   this.programs = [];

   this.availablePrograms = [
      {id: 0, name: 'Rend.er', description: 'Visibility', selected: false, required: 7, available: 1,
         map: [[0, 1, 1],
            [1, 1, 1],
            [1, 1, 0]]},
      {id: 1, name: 'Tim.er', description: 'Realtime Movement', selected: false, required: 5, available: 1,
         map: [[0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]]},
      {id: 2, name: 'Sp.read', description: 'Bullet Spread', selected: false, required: 8, available: 0,
         map: [[1, 1, 0],
            [1, 0, 1],
            [1, 1, 1]]},
      {id: 3, name: 'Gl.ue', description: 'Slower Enemies', selected: false, required: 5, available: 0,
         map: [[0, 1, 1],
            [1, 0, 0],
            [0, 1, 1]]},
      {id: 4, name: 'Str.dex', description: 'Damage up', selected: false, required: 8, available: 0,
         map: [[1, 0, 0],
            [1, 0, 1],
            [1, 1, 1]]},
      {id: 5, name: 'Shr.ink', description: 'Smaller battlefield', selected: false, required: 3, available: 0,
         map: [[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]]},
      {id: 6, name: 'Hom.er', description: 'Homing bullets', selected: false, required: 5, available: 0,
         map: [[0, 0, 1],
            [0, 1, 1],
            [0, 0, 0]]},
      {id: 7, name: 'Durabl.e', description: 'More Health to the mainframe', selected: false, required: 5, available: 0,
         map: [[1, 0, 1],
            [1, 1, 1]]}];

   this.corrupted = 0;
   this.size         = size; // Size of the grid
   this.inputManager = new InputManager;

   this.levels = new LevelManager;

   this.inputManager.on("runProgram", this.runProgram.bind(this));
   this.inputManager.on("pause", this.pause.bind(this));
   this.shooterGrid = null;

   this.messageContainer = $(".game-message");

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
   var self = this;
   self.grid = new Grid(self.size);

   this.messageContainer.find(".title")[0].innerHTML = "Level 1: " + self.levels.currentTitle();
   this.messageContainer.find(".message")[0].innerHTML = self.levels.currentMessage();
   this.messageContainer.fadeIn();
   $(".see-program-button").click(function() {
      self.messageContainer.fadeOut();
   });
};

GameManager.prototype.runProgram = function() {
   var self = this;

   this.grid.runProgram(250, function() {
      self.startShooter(self.grid.programAttributes());
   });
};

GameManager.prototype.startShooter = function(attrs) {
   if(!attrs[5])
      attrs[5] = 0;
   var height = 21 - 2 * attrs[5];
   $(".game-container").animate({"height": height*27 + "px"});
   this.shooterGrid = new GameGrid(27, height, this, attrs, this.inputManager.keys, this.levels.getCurrentLevel(), this.corrupted);
};

GameManager.prototype.wonLevel = function() {
   var self = this;

   var level = this.levels.levels[this.levels.currentLevel++];
   for(var ndx = 0; ndx < level.unlock.length; ndx ++) {
      var unlock = level.unlock[ndx]
      this.availablePrograms[unlock.id].available += unlock.amt;
   }
   this.programDrawer.$apply();
   if(this.corruped > 0)
      this.corrupted -= 0.05;

   setTimeout(function() {
      self.startProgrammer();
      if(self.levels.currentLevel == self.levels.levels.length)
         self.wonGame()
   }, 500);
};

GameManager.prototype.corrupt = function() {
   var self = this;

   this.levels.currentLevel++;
   this.corrupted = this.grid.corrupted = 0.4;
   var gameContainer = $(".game-container");

   gameContainer.animate({"background-color": "#000000"});
   gameContainer.effect("shake");
   gameContainer.animate({"background-color": "#FFFFFF"});
   gameContainer.animate({"background-color": "#F33298"});
   gameContainer.animate({"background-color": "#897F68"});
   gameContainer.animate({"background-color": "#794165"});
   gameContainer.effect("shake", {direction: "up"});
   gameContainer.animate({"background-color": "#ABC6D5"});
   gameContainer.animate({"background-color": "#FFFFFF"});
   gameContainer.animate({"background-color": "#77FF77"});
   gameContainer.effect("shake", {direction: "right", distance: 100});
   gameContainer.animate({"background-color": "#000000"}, function() {
      self.startProgrammer();
   });
}

GameManager.prototype.wonGame = function() {
   this.messageContainer.find(".title")[0].innerHTML = "You win!!";
   this.messageContainer.fadeIn();
   $(".see-program-button").click(function() {
      $(".program-drawer").hide();
      $(".game-container").animate({"width": "491px"});
   })
};

GameManager.prototype.startProgrammer = function() {
   this.shooterGrid = null;
   this.messageContainer.find(".title")[0].innerHTML = "Level " + (this.levels.currentLevel + 1) + ": " + this.levels.currentTitle();
   this.messageContainer.find(".message")[0].innerHTML = this.levels.currentMessage();
   this.messageContainer.fadeIn();
   this.grid.appear(this.corrupted);
};

GameManager.prototype.move = function(direction) {
   if(this.shooterGrid) {
      this.shooterGrid.move(this.getVector(direction))
   }
};

GameManager.prototype.pause = function() {
   if(this.shooterGrid) {
      this.shooterGrid.pause();
   }
};

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