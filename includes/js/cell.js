function GridCell(grid, position, element) {
   var self = this;

   this.position = position;
   this.element = element;

   this.active = false;
   this.wasActive = false;
   this.hover = 0;

   this.grid = grid;

   this.tile = document.createElement("div");
   this.tile.setAttribute("class", "grid-cell grid-cell-dynamic grid-cell-new");
   $(this.tile).click(function() { grid.placeProgram(position); });
   $(this.tile).mouseenter(function() { grid.hover(position); });
}

GridCell.prototype.toggle = function(click) {
   var self = this;

   this.active = !this.active;
   var animStr = click ? "-flip" : "-fade"

   if(this.active)
     this.tile.setAttribute("class", "grid-cell grid-cell-active"+animStr);
   else
     this.tile.setAttribute("class", "grid-cell grid-cell-inactive"+animStr);

   var newTile = this.tile.cloneNode(true)
   this.tile.parentNode.replaceChild(newTile, this.tile)
   this.tile = newTile;
   $(this.tile).click(function() { self.grid.placeProgram(self.position); });
   $(this.tile).mouseenter(function() { self.grid.hover(self.position); });
}

GridCell.prototype.appear = function() {
   var self = this;

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