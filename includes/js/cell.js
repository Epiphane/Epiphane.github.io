function GridCell(grid, position, corrupted) {
   var self = this;

   this.position = position;

   this.active = false;
   this.wasActive = false;
   this.activeBeforeWas = false;
   this.hover = 0;

   this.grid = grid;

   this.tile = document.createElement("div");
   this.tile.setAttribute("class", "grid-cell grid-cell-dynamic grid-cell-new");
   if(corrupted) {
      this.tile.classList.add("grid-cell-corrupted");
      this.tile.classList.add("corrupt-" + Math.ceil(Math.random() * 3));
   }
   //if(this.crucial = crucial)
      //this.tile.classList.add("grid-cell-crucial")

   $(this.tile).mouseenter(function() { grid.hover(position); });
}

GridCell.prototype.toggle = function(click) {
   var self = this;

   this.active = !this.active;
   var animStr = click ? "-flip" : "-fade"

   this.tile.classList.remove("grid-cell-inactive-fade");
   this.tile.classList.remove("hover-active");
   this.tile.classList.remove("hover-inactive");
   if(this.active) {
      this.tile.classList.remove("grid-cell-inactive-flip")
      this.tile.classList.remove("grid-cell-inactive-fade")
      this.tile.classList.add("grid-cell-active"+animStr)
   }
   else {
      this.tile.classList.remove("grid-cell-active-flip")
      this.tile.classList.remove("grid-cell-active-fade")
      this.tile.classList.add("grid-cell-inactive"+animStr)
   }

   var newTile = this.tile.cloneNode(true)
   this.tile.parentNode.replaceChild(newTile, this.tile)
   this.tile = newTile;
   $(this.tile).mouseenter(function() { self.grid.hover(self.position); });
}

GridCell.prototype.appear = function(corrupted) {
   var self = this;

   if(corrupted && Math.random() < corrupted) {
      this.tile.classList.add("grid-cell-corrupted");
      this.tile.classList.add("corrupt-" + Math.ceil(Math.random() * 3));
   }
   else
      this.tile.classList.add("grid-cell-new")
   this.tile.classList.remove("grid-cell-die")

   var newTile = this.tile.cloneNode(true)
   this.tile.parentNode.replaceChild(newTile, this.tile)
   this.tile = newTile;
   $(this.tile).click(function() { self.grid.placeProgram(self.position); });
   $(this.tile).mouseenter(function() { self.grid.hover(self.position); });
}

GridCell.prototype.disappear = function() {
   this.tile.classList.remove("grid-cell-new")
   this.tile.classList.remove("grid-cell-corrupted")
   this.tile.classList.add("grid-cell-die")

   var newTile = this.tile.cloneNode(true)
   this.tile.parentNode.replaceChild(newTile, this.tile)
   this.tile = newTile;
}

GridCell.prototype.setHover = function(hover) {
   if(hover == this.hover)
      return false;

   this.hover = hover;

   this.tile.classList.remove("grid-cell-inactive-fade");
   this.tile.classList.remove("hover-active");
   this.tile.classList.remove("hover-inactive");

   if(this.hover == 2) {
      this.tile.classList.add("hover-active");
   }
   else if(this.hover == 1) {
      this.tile.classList.add("hover-inactive");
   }
}

GridCell.prototype.getDiv = function() {
   return this.tile;
}