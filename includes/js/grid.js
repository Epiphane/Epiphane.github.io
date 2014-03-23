function Grid(size) {
  this.size = size;

  this.cells = [];

  this.build();
}

// Build a grid of the specified size
Grid.prototype.build = function () {
    var gridContainer = document.querySelector(".grid-container");

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
                newTile = new GridCell({ x: col, y: row });
                self.cells[row].push(newTile)

                $.find(".grid-row:eq("+row+")")[0].appendChild(newTile.getDiv());
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

Grid.prototype.iterate = function() {
   var self = this;

   this.eachCell(function(x, y, cell) {
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
}