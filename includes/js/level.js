/**
 * Created by ThomasSteinke on 3/27/14.
 */

function LevelManager() {
   this.levels = [
      new Level([{enemy: BasicEnemy, delay: 100, amount: 1}])
   ];

   this.currentLevel = 0;
}

LevelManager.prototype.getLevel = function(level) {
   return this.levels[level];
}

LevelManager.prototype.getCurrentLevel = function() {
   return this.getLevel(this.currentLevel);
}

function Level(waves) {
   this.waves = waves;
}

Level.prototype.getInfo = function() {
   return {waves: this.waves};
}