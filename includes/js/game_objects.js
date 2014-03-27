/**
 * Created by ThomasSteinke on 3/25/14.
 */

function GameObject(position, world) {
   this.world = world;

   if(!position)
      position = {x: 0, y: 0};

   this.size = {w: 2, h: 2};

   this.position = position;
   this.initDiv(position);
}

GameObject.prototype.initDiv = function(position) {
   this.div = document.createElement("div");
   this.positionAttr = "tile-position-" + position.x + "-" + position.y;
   this.div.setAttribute("class", "grid-cell tile");
   this.div.classList.add(this.positionAttr);
}

GameObject.prototype.updatePosition = function(position) {
   var TILE_WIDTH = 14

   this.position = {x: position.x, y: position.y};
   this.div.classList.remove(this.positionAttr);
   this.positionAttr = "tile-position-" + position.x + "-" + position.y;
   this.div.classList.add(this.positionAttr);

   //this.div.style.top = (position.y * TILE_WIDTH - TILE_WIDTH) + "px"
   //this.div.style.left = (position.x * TILE_WIDTH - TILE_WIDTH) + "px"
   this.div.style.webkitTransform = "translate(" + (position.x * TILE_WIDTH - TILE_WIDTH) + "px, " + (position.y * TILE_WIDTH - TILE_WIDTH) + "px)";
   this.div.style.mozTransform = "translate(" + (position.x * TILE_WIDTH - TILE_WIDTH) + "px, " + (position.y * TILE_WIDTH - TILE_WIDTH) + "px)";
   this.div.style.transform = "translate(" + (position.x * TILE_WIDTH - TILE_WIDTH) + "px, " + (position.y * TILE_WIDTH - TILE_WIDTH) + "px)";
}

GameObject.prototype.move = function(direction) {
   var newPos = this.position;

   newPos.x += direction.x / 2;
   newPos.y += direction.y / 2;

   if(newPos.x < 1)
      newPos.x = 1;
   if(newPos.x > this.world.width)
      newPos.x = this.world.width;
   if(newPos.y < 1)
      newPos.y = 1;
   if(newPos.y > this.world.height)
      newPos.y = this.world.height;

   this.updatePosition(newPos);
}

GameObject.prototype.update = function() {
   console.log("No update for me!")
}

GameObject.prototype.getShot = function() {
   return 0;
}

GameObject.prototype.getDiv = function() {
   return this.div;
}

PlayerShip.prototype = new GameObject();
PlayerShip.prototype.constructor = PlayerShip;

function PlayerShip(position, world, spread) {
   this.world = world;
   this.shootDelay = 0;
   this.updatePosition(position)
   this.spread = spread;

   this.div.classList.add("player-ship")
   this.div.innerHTML = ":)"
}

PlayerShip.prototype.shoot = function() {
   if(this.shootDelay-- <= 0) {
      var newBullet = new PlayerBullet({x: this.position.x + 0.5, y: this.position.y + 0.25}, this.world, {x: 2, y: 0})
      this.world.addObject(newBullet, true)

      if(this.spread) {
         newBullet = new PlayerBullet({x: this.position.x + 0.5, y: this.position.y + 0.5}, this.world, {x: 2, y: 1})
         this.world.addObject(newBullet, true)

         newBullet = new PlayerBullet({x: this.position.x + 0.5, y: this.position.y}, this.world, {x: 2, y: -1})
         this.world.addObject(newBullet, true)
      }

      this.shootDelay = 5;
   }
}

PlayerBullet.prototype = new GameObject();
PlayerBullet.prototype.constructor = PlayerBullet;

function PlayerBullet(position, world, direction) {
   this.initDiv(position);

   this.world = world;
   this.direction = direction
   this.updatePosition(position)

   this.div.classList.add("player-bullet")
}

PlayerBullet.prototype.update = function() {
   var self = this;
   var newPos = this.position;

   newPos.x += this.direction.x / 2;
   newPos.y += this.direction.y / 2;

   if(newPos.x < 1 || newPos.x > this.world.width || newPos.y < 1 || newPos.y > this.world.height)
      this.world.removeObject(this);
   else {
      this.world.eachObject(function(obj) {
         if(self.position.x + self.size.w > obj.position.x && self.position.y + self.size.h > obj.position.y &&
             self.position.x < obj.position.x + obj.size.w && self.position.y < obj.position.y + obj.size.h) {
            var shot = obj.getShot();

            if(shot > 0)
               self.world.removeObject(self);
            if(shot == 2)
               return -1;

         }
      })
      this.updatePosition(newPos);
   }
}

BasicEnemy.prototype = new GameObject();
BasicEnemy.prototype.constructor = BasicEnemy;

function BasicEnemy(position, world, slow) {
   this.world = world;
   this.health = 2;
   this.initDiv(position);
   this.updatePosition(position)

   this.slow = slow;

   this.div.classList.add("basic-enemy-ship")
}

BasicEnemy.prototype.update = function() {
   if(this.slow)
      this.move({x: -0.75 / (this.slow + 1), y: 0})
   else
      this.move({x: -1, y: 0})

   if(this.position.x == 1) {
      this.world.takeAHit(200);
      this.world.removeObject(this, true);
   }
}

BasicEnemy.prototype.getShot = function() {
   if(this.health-- <= 0) {
      this.world.removeObject(this);

      return 2;
   }
   return 1;
}

Corrupter.prototype = new BasicEnemy({x: 0, y: 0});
Corrupter.prototype.constructor = Corrupter;

function Corrupter(position, world, slow) {
   this.world = world;
   this.health = 2;
   this.initDiv(position);
   this.updatePosition(position)

   this.slow = slow;

   this.div.classList.add("basic-enemy-ship")
}