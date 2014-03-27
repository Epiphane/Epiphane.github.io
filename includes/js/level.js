/**
 * Created by ThomasSteinke on 3/27/14.
 */

function LevelManager() {
   this.levels = [
      new Level([{enemy: BasicEnemy, delay: 100, amount: 10}]),
      new Level([{enemy: Corrupter, delay: 5, amount: 10}])
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
   waves = []
   this.waves.forEach(function(wave) {
      waves.push({enemy: wave.enemy, delay: wave.delay, amount: wave.amount});
   })

   return {waves: waves};
}