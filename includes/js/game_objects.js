/**
 * Created by ThomasSteinke on 3/25/14.
 */

var dontYellAtMe = true;

function GameObject(position, world) {
   this.world = world;

   if(!position)
      position = {x: 0, y: 0};

   this.size = {w: 1, h: 1};

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
   var TILE_WIDTH = 27

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

   newPos.x += direction.x / 4;
   newPos.y += direction.y / 4;

   if(newPos.x < 1)
      newPos.x = 1;
//   if(newPos.x + this.size.w + 1 > this.world.width)
//      newPos.x = this.world.width - this.size.w - 1;
   if(newPos.y < 1)
      newPos.y = 1;
   if(newPos.y + this.size.h - 1 > this.world.height)
      newPos.y = this.world.height - this.size.h + 1;

   this.updatePosition(newPos);
}

GameObject.prototype.update = function() {
   console.log("No update for me!")
}

GameObject.prototype.getShot = function(damage) {
   return 0;
}

GameObject.prototype.getDiv = function() {
   return this.div;
}

PlayerShip.prototype = new GameObject();
PlayerShip.prototype.constructor = PlayerShip;

function PlayerShip(position, world, spread, damage) {
   this.world = world;
   this.shootDelay = 0;
   this.updatePosition(position)
   if(!spread)
      spread = 0;
   this.spread = spread;
   this.damage = damage / (spread * 2 + 1);

   this.div.classList.add("player-ship")
   if(this.world.manager.corrupted > 0.4)
      this.div.innerHTML = "¬∆";
   else if(this.world.manager.corrupted > 0.3)
      this.div.innerHTML = "å";
   else if(this.world.manager.corrupted > 0.2)
      this.div.innerHTML = "@";
   else if(this.world.manager.corrupted > 0.1)
      this.div.innerHTML = ":(";
   else
      this.div.innerHTML = ":)";
}

PlayerShip.prototype.shoot = function() {
   if(this.shootDelay-- <= 0) {
      var newBullet = new PlayerBullet(this.damage, {x: this.position.x + 0.5, y: this.position.y}, this.world, {x: 2, y: 0})
      this.world.addObject(newBullet, true)

      if(this.spread) {
         newBullet = new PlayerBullet(this.damage, {x: this.position.x + 0.5, y: this.position.y + 0.25}, this.world, {x: 2, y: 1})
         this.world.addObject(newBullet, true)

         newBullet = new PlayerBullet(this.damage, {x: this.position.x + 0.5, y: this.position.y - 0.25}, this.world, {x: 2, y: -1})
         this.world.addObject(newBullet, true)

         if(this.spread == 2) {
            newBullet = new PlayerBullet(this.damage, {x: this.position.x + 0.5, y: this.position.y + 0.1}, this.world, {x: 2, y: 0.5})
            this.world.addObject(newBullet, true)

            newBullet = new PlayerBullet(this.damage, {x: this.position.x + 0.5, y: this.position.y - 0.1}, this.world, {x: 2, y: -0.5})
            this.world.addObject(newBullet, true)
         }
      }

      this.shootDelay = 5;
   }
}

PlayerBullet.prototype = new GameObject();
PlayerBullet.prototype.constructor = PlayerBullet;

function PlayerBullet(damage, position, world, direction) {
   this.damage = damage;
   this.initDiv(position);

   this.world = world;
   this.direction = direction
   this.updatePosition(position)

   this.div.classList.add("player-bullet")
}

PlayerBullet.prototype.update = function() {
   var self = this;
   var newPos = this.position;

   if(newPos.x < 1 || newPos.x > this.world.width || newPos.y < 1 || newPos.y > this.world.height)
      this.world.removeObject(this);
   else {
      var removed = false;
      this.world.eachObject(function(obj) {
         if (self.position.y < obj.position.y + obj.size.h && self.position.x < obj.position.x + obj.size.w && self.position.y + self.size.h > obj.position.y && self.position.x + self.size.w > obj.position.x) {
            var shot = obj.getShot(self.damage);

            if (shot > 0 && !removed) {
               self.world.removeObject(self);
               removed = true;
            }
            if (shot == 2)
               return -1;
         }
      })
   }

   newPos.x += this.direction.x / 2;
   newPos.y += this.direction.y / 2;
   this.updatePosition(newPos);
}

BasicEnemy.prototype = new GameObject();
BasicEnemy.prototype.constructor = BasicEnemy;

function BasicEnemy(position, world, slow) {
   this.world = world;
   this.health = 2;
   this.damage = 60;
   this.speed = -0.75;
   this.initDiv(position);
   this.updatePosition(position)

   this.slow = slow;

   this.div.classList.add("basic-enemy-ship")
}

BasicEnemy.prototype.update = function() {
   if(this.slow)
      this.move({x: this.speed / (this.slow + 1), y: 0})
   else
      this.move({x: this.speed, y: 0})

   var ship = this.world.ship
   if(this.position.x == 1 ||
       this.position.y < ship.position.y + ship.size.h && this.position.x < ship.position.x + ship.size.w &&
           this.position.y + this.size.h > ship.position.y && this.position.x + this.size.w > ship.position.x) {
      this.world.takeAHit(this.damage);
      this.world.removeObject(this, true);
   }
};

BasicEnemy.prototype.getShot = function(damage) {
   this.health -= damage;

   if(this.health < 0) {
      this.world.removeObject(this);

      return 2;
   }
   return 1;
}

BasicMovingEnemy.prototype = new BasicEnemy({x: 0, y: 0});
BasicMovingEnemy.prototype.constructor = BasicMovingEnemy;

function BasicMovingEnemy(position, world, slow) {
   this.world = world;
   this.speed = -0.5;
   this.up = 50;
   this.initDiv(position);
   this.updatePosition(position)

   this.slow = slow;

   this.div.classList.add("basic-enemy-ship")
}

BasicMovingEnemy.prototype.update = function() {
   var mov = {x: this.speed, y: this.speed / 2};
   if(this.slow)
      mov.x /= (this.slow + 1)

   if(this.up-- < 0)
      mov.y *= -1;
   if(this.up < -50)
      this.up = 50;

   this.move(mov)

   var ship = this.world.ship
   if(this.position.x == 1 ||
       this.position.y < ship.position.y + ship.size.h && this.position.x < ship.position.x + ship.size.w &&
           this.position.y + this.size.h > ship.position.y && this.position.x + this.size.w > ship.position.x) {
      this.world.takeAHit(this.damage);
      this.world.removeObject(this, true);
   }
};

SuperCorrupter.prototype = new BasicMovingEnemy({x: 0, y: 0});
SuperCorrupter.prototype.constructor = SuperCorrupter;

function SuperCorrupter(position, world, slow) {
   this.world = world;
   this.health = 2;
   this.damage = 10;
   this.speed = -1.5;
   this.initDiv(position);
   this.updatePosition(position)

   this.slow = slow;

   this.div.classList.add("basic-enemy-ship")
}

BasicShootingEnemy.prototype = new BasicEnemy({x: 0, y: 0});
BasicShootingEnemy.prototype.constructor = BasicShootingEnemy;

function BasicShootingEnemy(position, world, slow) {
   this.world = world;
   this.shotTimer = 10;
   this.speed = -0.25
   this.initDiv(position);
   this.updatePosition(position)

   this.slow = slow;

   this.div.classList.add("basic-enemy-ship")
}

BasicShootingEnemy.prototype.update = function() {
   BasicEnemy.prototype.update.call(this);

   if(this.shotTimer -- < 0) {
      this.shotTimer = 100;

      var newBullet = new EnemyBullet({x: this.position.x - 1, y: this.position.y + 0.25}, this.world, {x: -0.75, y: 0})
      this.world.addObject(newBullet, true)
   }
};

EnemyBullet.prototype = new GameObject();
EnemyBullet.prototype.constructor = EnemyBullet;

function EnemyBullet(position, world, direction) {
   this.initDiv(position);
   this.damage = 5;
   this.world = world;
   this.direction = direction
   this.updatePosition(position);

   this.div.classList.add("player-bullet")
}

EnemyBullet.prototype.update = function() {
   var self = this;
   var newPos = this.position;

   if(newPos.x < 1 || newPos.x > this.world.width || newPos.y < 1 || newPos.y > this.world.height)
      this.world.removeObject(this);
   else {
      var obj = this.world.ship;
      if (self.position.y < obj.position.y + obj.size.h && self.position.x < obj.position.x + obj.size.w && self.position.y + self.size.h > obj.position.y && self.position.x + self.size.w > obj.position.x) {
         this.world.takeAHit(this.damage);
         this.world.removeObject(this, false);
      }
   }

   newPos.x += this.direction.x / 2;
   newPos.y += this.direction.y / 2;
   this.updatePosition(newPos);
};

Corrupter.prototype = new BasicEnemy({x: 0, y: 0});
Corrupter.prototype.constructor = Corrupter;

function Corrupter(position, world, slow) {
   this.world = world;
   this.health = 1;
   this.damage = 10;
   this.speed = -1.5;
   this.initDiv(position);
   this.updatePosition(position)

   this.slow = slow;

   this.div.classList.add("basic-enemy-ship")
}

TankEnemy.prototype = new BasicEnemy({x: 0, y: 0});
TankEnemy.prototype.constructor = TankEnemy;

function TankEnemy(position, world, slow) {
   this.world = world;
   this.health = 80;
   this.damage = 120;
   this.speed = -0.25;
   this.position = position;

   this.size = {w: 3, h: 5};

   this.initDiv(this.position);
   this.updatePosition(this.position)

   this.slow = slow;
}

TankEnemy.prototype.initDiv = function(position) {
   this.div = document.createElement("div");
   this.positionAttr = "tile-position-" + position.x + "-" + position.y;
   this.div.setAttribute("class", "grid-cell tile large-enemy-ship tank-enemy-ship");
   this.div.classList.add(this.positionAttr);

   var map = [
      [0, 1, 0],
      [0, 1, 1],
      [1, 1, 1],
      [0, 1, 1],
      [0, 1, 0]
   ];

   var div, rowDiv;
   for(var row = 0; row < map.length; row ++) {
      rowDiv = document.createElement("div");
      rowDiv.setAttribute("class", "grid-row");

      for(var col = 0; col < map[0].length; col ++) {
         div = document.createElement("div");
         div.setAttribute("class", "grid-cell tile tank-enemy-ship");
         if(!map[row][col])
            div.classList.add("none")

         rowDiv.appendChild(div)
      }

      rowDiv.style.setProperty("width", "82px")
      this.div.appendChild(rowDiv)
   }
};

KingCorrupter.prototype = new BasicEnemy({x: 0, y: 0});
KingCorrupter.prototype.constructor = KingCorrupter;

function KingCorrupter(position, world, slow) {
   this.world = world;
   this.health = 200;
   this.damage = 10;
   this.position = {x: this.world.width + 1, y: 2}

   this.size = {w: 3, h: 9};

   this.initDiv(this.position);
   this.updatePosition(this.position)

   this.slow = slow;

   this.div.classList.add("large-enemy-ship")
   this.div.classList.add("king-corrupter-ship")
}

KingCorrupter.prototype.initDiv = function(position) {
   this.div = document.createElement("div");
   this.positionAttr = "tile-position-" + position.x + "-" + position.y;
   this.div.setAttribute("class", "grid-cell tile large-enemy-ship king-corrupter-ship");
   this.div.classList.add(this.positionAttr);

   var map = [
      [0, 1, 0],
      [0, 1, 1],
      [1, 1, 1],
      [0, 1, 1],
      [1, 1, 0],
      [0, 1, 1],
      [1, 1, 1],
      [0, 1, 1],
      [0, 1, 0]
   ];

   var div, rowDiv;
   for(var row = 0; row < map.length; row ++) {
      rowDiv = document.createElement("div");
      rowDiv.setAttribute("class", "grid-row");

      for(var col = 0; col < map[0].length; col ++) {
         div = document.createElement("div");
         div.setAttribute("class", "grid-cell tile king-corrupter-ship");
         if(!map[row][col])
            div.classList.add("none")

         rowDiv.appendChild(div)
      }

      rowDiv.style.setProperty("width", "82px")
      this.div.appendChild(rowDiv)
   }
};

KingCorrupter.prototype.update = function() {
   if(this.position.x > this.world.width - 5)
      this.move({x: -0.1, y: 0})

   var ship = this.world.ship
   if(this.position.x == 1 ||
       this.position.y < ship.position.y + ship.size.h && this.position.x < ship.position.x + ship.size.w &&
           this.position.y + this.size.h > ship.position.y && this.position.x + this.size.w > ship.position.x) {
      this.world.takeAHit(this.damage);
   }
};