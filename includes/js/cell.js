function GridCell(position, element) {
   var self = this;

   this.position = position;
   this.element = element;

   this.active = false;
   this.wasActive = false;

   this.tile = document.createElement("div");
   this.tile.setAttribute("class", "grid-cell grid-cell-new");
   $(this.tile).click(function() { self.toggle(true); });
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
   $(this.tile).click(function() { self.toggle(true); });
}

GridCell.prototype.getDiv = function() {
   return this.tile;
}