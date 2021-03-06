function Grid(size) {
   var self = this;
   this.programs = [];

   this.size = size;
   this.corrupted = 0;
   this.gridPosition = null;

   this.build();

   $(".in-game-instructions").slideUp()
   $(".clear-button").click(function() { self.build(self) })
   $(".grid-container").click(function() { self.placeProgram(); });
}

// Build a grid of the specified size
Grid.prototype.build = function () {
   this.cells = [];
   this.program = null;
   while(this.programs.length > 0) {
      var prog = this.programs.shift();
      prog.program.available ++;
      var div = prog.getDiv();

      div.parentNode.removeChild(div)
   }
   angular.element($(".program-drawer")).scope().$apply()

   var gridContainer = document.querySelector(".grid-container");
   $(".grid-container").empty();

   for(var row = 0; row < this.size * 2; row ++) {
      if(row < this.size) {
         var newRow = document.createElement("div")
         newRow.setAttribute("class", "grid-row")

         gridContainer.appendChild(newRow)
         this.cells.push([])
      }

      this.buildDiagonal(row)
   }
};

Grid.prototype.buildDiagonal = function(row) {
   var self = this;

   window.requestAnimationFrame(function() {
      var newTile;

      for(var col = 0; col < self.size && row >= 0; row -- && col ++) {
         if (row < self.size) {
            newTile = new GridCell(self, { x: col, y: row }, self.corrupted);
            self.cells[row].push(newTile)

            $(".grid-container").find(".grid-row:eq("+row+")")[0].appendChild(newTile.getDiv());
         }
      }
   });
}

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
   for (var x = 0; x < this.size; x++) {
      for (var y = 0; y < this.size; y++) {
         callback(x, y, this.cells[x][y]);
      }
   }
};

Grid.prototype.runProgram = function(step, callback) {
   if(step == 0) {
      this.disappear(callback);
      return;
   }

   var self = this;
   var changed = false;

   window.requestAnimationFrame(function() {
      self.programs.forEach(function(program) {
         program.testValid();
      });

      self.disappear(callback);
   });
}

Grid.prototype.appear = function(corrupted) {
   var self = this;

   setTimeout(function() {
      $(".shooter-grid-container").empty()
      $(".shooter-tile-container").empty()
      $(".game-container").animate({"height": "490px"})
      $(".program-back").fadeIn();
      $(".program-drawer").fadeIn();
      for(var row = 0; row < self.size * 2; row ++) {
         self.showDiagonal(row, corrupted)
      }
      $(".in-game-instructions").slideUp()
   }, 500);
}

Grid.prototype.showDiagonal = function(row, corrupted) {
   var self = this;

   window.requestAnimationFrame(function() {
      for(var col = 0; col < self.size && row >= 0; row -- && col ++) {
         if (row < self.size) {
            self.cells[row][col].appear(corrupted)
         }
      }
   });
}

Grid.prototype.disappear = function(callback) {
   var self = this;

   setTimeout(function() {
      $(".program-back").fadeOut();
      $(".program-drawer").fadeOut();
      for(var row = 0; row < self.size * 2; row ++) {
         self.hideDiagonal(row)

         if(row == self.size * 2 - 1)
            window.requestAnimationFrame(function() {
               callback();
            })
      }
   }, 500);
}

Grid.prototype.hideDiagonal = function(row) {
   var self = this;

   window.requestAnimationFrame(function() {
      for(var col = 0; col < self.size && row >= 0; row -- && col ++) {
         if (row < self.size) {
            self.cells[row][col].disappear()
         }
      }
   });
}

Grid.prototype.iterateLife = function() {
   var self = this;

   this.eachCell(function(x, y, cell) {
      cell.activeBeforeWas = cell.wasActive;
      cell.wasActive = cell.active;
   });

   this.eachCell(function(x, y, cell) {
      var score = 0;
      for(var col = -1; col <= 1; col ++) {
         for(var row = -1; row <= 1; row ++) {
            if(x + col >= 0 && y + row >= 0 && x + col < self.size && y + row < self.size) {
               if(col != 0 || row != 0) {
                  score += self.cells[x + col][y + row].wasActive ? 1 : 0;
               }
            }
         }
      }

      if(score == 3 && !cell.active) {
         cell.toggle(false);
      }
      else if(cell.active && (score < 2 || score > 3)) {
         cell.toggle(false);
      }
   });

   this.programs.forEach(function(program) {
      program.testValid();
   });

   var changed = 0;
   this.eachCell(function(x, y, cell) {
      if(cell.wasActive != cell.active)
         changed |= 1;
      if(cell.activeBeforeWas != cell.active)
         changed |= 2;
   });

   return changed == 3;
}

Grid.prototype.hover = function(position) {
   this.gridPosition = position;

   if(this.program) {
      var width = this.program.map[0].length;
      var height = this.program.map.length;
      var px = position.x - Math.floor(width / 2);
      var py = position.y - Math.floor(height / 2);

      this.eachCell(function(x, y, cell) {
         cell.setHover(0);
      });

      for(var row = py; row < py + height; row ++) {
         for(var col = px; col < px + width; col ++) {
            if(col >= 0 && row >= 0 &&
                row < this.size && col < this.size) {
               this.cells[row][col].setHover(this.program.map[row - py][col - px] + 1);
            }
         }
      }
   }
}

Grid.prototype.placeProgram = function() {
   if(this.program && this.gridPosition) {
      var width = this.program.map[0].length;
      var height = this.program.map.length;
      var px = this.gridPosition.x - Math.floor(width / 2);
      var py = this.gridPosition.y - Math.floor(height / 2);

      if(px < 0 || py < 0 || px + width > this.size || py + height > this.size)
         return false;

      var cellsToWatch = [];
      for(var row = py; row < py + height; row ++) {
         for(var col = px; col < px + width; col ++) {
            if(!this.cells[row][col].active && this.program.map[row - py][col - px])
               this.cells[row][col].toggle(true);
            else
               this.cells[row][col].setHover(0);

            cellsToWatch.push(this.cells[row][col])
         }
      }

      var programBack = new ProgramWrapper(this.program, {x: px, y: py}, cellsToWatch)
      this.programs.push(programBack)
      var gameContainer = document.querySelector(".game-container")
      gameContainer.appendChild(programBack.getDiv())

      this.programs.forEach(function(program) {
         program.testValid();
      });

      this.program.available--;
      this.program = null;
      angular.element($(".program-drawer")).scope().deselect()
      angular.element($(".program-drawer")).scope().$apply()
   }
};

Grid.prototype.programAttributes = function() {
   var attributes = [];

   this.programs.forEach(function(program) {
      program.setAttribute(attributes);
   });

   return attributes;
}