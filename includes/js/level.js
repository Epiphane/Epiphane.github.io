/**
 * Created by ThomasSteinke on 3/27/14.
 */

function LevelManager() {
   this.levels = [
      new Level("Hello world!", "Make sure you use Rend.er, or you won't be able to see well!",
          [{enemy: BasicEnemy, delay: 100, amount: 10}]),
      new Level("Corruption", "Something doesn't feel right...",
          [{enemy: Corrupter, delay: 5, amount: 100}])
   ];

   this.currentLevel = 0;
}

LevelManager.prototype.getLevel = function(level) {
   return this.levels[level];
};

LevelManager.prototype.getCurrentLevel = function() {
   return this.getLevel(this.currentLevel);
};

LevelManager.prototype.currentTitle = function() {
   if(this.currentLevel == this.levels.length)
      return "You win!"
   return this.levels[this.currentLevel].title
};

LevelManager.prototype.currentMessage = function() {
   if(this.currentLevel == this.levels.length)
      return "(Hooray)"
   return this.levels[this.currentLevel].message
};

function Level(title, message, waves) {
   this.title = title;
   this.message = message;
   this.waves = waves;
}

Level.prototype.getInfo = function() {
   waves = [];
   this.waves.forEach(function(wave) {
      waves.push({enemy: wave.enemy, delay: wave.delay, amount: wave.amount});
   });

   return {waves: waves};
};