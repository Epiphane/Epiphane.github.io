/**
 * Created by ThomasSteinke on 3/25/14.
 */

function GameGrid(width, height, gameManager, attrs, keys) {
   var VISIBLE = 0;
   var REALTIME = 1;

   var self = this;
   this.paused = false;
   this.manager = gameManager;

   this.attrs = attrs;

   this.width = width;
   this.height = height;
   this.enemyTimer = 100;

   this.health = width * height;

   this.objects = [];

   this.cellsToKill = [];
   this.cells = [];
   this.build();

   if(!this.attrs[VISIBLE])
      document.querySelector(".shooter-tile-container").style.setProperty("opacity", "0.2")

   window.requestAnimationFrame(function() {
      self.ship = new PlayerShip({x: 1, y: 7}, self)
      self.addObject(self.ship, false)

      self.update(keys)
   })
}

GameGrid.prototype.pause = function() {
   this.paused = true;
}

GameGrid.prototype.update = function(input) {
   var VISIBLE = 0;
   var REALTIME = 1;
   var self = this;

   window.requestAnimationFrame(function() {
      if(self.paused)
         return;

      var delay = !self.attrs[REALTIME];

      for(var x = 0; x < 3; x ++)
         if(self.cellsToKill.length > 0) {
            var cell = self.cellsToKill.shift();
            cell.parentNode.removeChild(cell)
         }

      for(var dir = 0; dir < 4; dir ++) {
         if(input[dir]) {
            var vector = self.getVector(dir);
            if(delay)
               setTimeout(function() {
                  self.ship.move(vector)
               }, 200);
            else
               self.ship.move(vector)
         }
      }

      if(input[4]) {
         if(input[dir])
            if(delay)
               setTimeout(function() {
                  self.ship.shoot();
               }, 200);
            else
               self.ship.shoot();
      }

      self.objects.forEach(function(obj) {
         obj.update();
      });

      if(self.enemyTimer-- < 0) {
         self.enemyTimer = 100;

         self.addObject(new BasicEnemy({x: self.width, y: Math.ceil(Math.random() * self.height)}, self), true)
      }

      self.update(input);
   });
}

GameGrid.prototype.loseGame = function() {
   var self = this;
   self.paused = true;

   window.requestAnimationFrame(function() {
      for(var x = 0; x < 3; x ++)
         if(self.cellsToKill.length > 0) {
            var cell = self.cellsToKill.shift();
            cell.parentNode.removeChild(cell)
         }

      $(".shooter-tile-container").empty()

      if(self.cellsToKill.length > 0)
         self.loseGame()
      else {
         self.manager.startProgrammer()
      }
   });
}

GameGrid.prototype.addObject = function(object, toArray) {
   if(toArray)
      this.objects.push(object)

   document.querySelector(".shooter-tile-container").appendChild(object.getDiv());
}

GameGrid.prototype.removeObject = function(object) {
   var ind = this.objects.indexOf(object);
   if(ind > -1)
      this.objects.splice(ind, 1);

   document.querySelector(".shooter-tile-container").removeChild(object.getDiv())
}

// Get the vector representing the chosen direction
GameGrid.prototype.getVector = function (direction) {
   // Vectors representing tile movement
   var map = {
      0: { x: 0,  y: -1 }, // Up
      1: { x: 1,  y: 0 },  // Right
      2: { x: 0,  y: 1 },  // Down
      3: { x: -1, y: 0 }   // Left
   };

   return map[direction];
};

GameGrid.prototype.build = function() {
   var self = this;

   $(".shooter-grid-container").empty();
   var gridContainer = document.querySelector(".shooter-grid-container");

   for(var row = 0; row < this.height; row ++) {
      var newRow = document.createElement("div")
      newRow.setAttribute("class", "grid-row")
      this.cells.push([])

      gridContainer.appendChild(newRow)
   }

   for(var col = 0; col < this.width; col ++) {
      window.requestAnimationFrame(function() {
         for(var row = 0; row < self.height; row ++) {
            var newTile = document.createElement("div");
            newTile.setAttribute("class", "grid-cell");
            self.cells[row].push(newTile)

            $(".shooter-grid-container").find(".grid-row:eq("+row+")")[0].appendChild(newTile);
         }
      });
   }
}

GameGrid.prototype.takeAHit = function(damage) {
   var self = this;
   this.health -= damage;

   while(damage-- > 0 && self.cells.length > 0) {
      var row = Math.floor(Math.random() * self.cells.length);

      var cell = self.cells[row].pop();
      self.cellsToKill.push(cell)
      if(self.cells[row].length == 0)
         self.cells.splice(row, 1)
   }

   if(this.cells.length == 0)
      this.loseGame()
}

GameGrid.prototype.move = function(direction) {
   this.ship.move(direction)
}

GameGrid.prototype.eachObject = function(callback) {
   for(var o = 0; o < this.objects.length; o ++)
      if(callback(this.objects[o]) == -1)
         o --;
}