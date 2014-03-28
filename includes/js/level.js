/**
 * Created by ThomasSteinke on 3/27/14.
 */

function LevelManager() {
   this.levels = [
      new Level("Hello world!", "Make sure you use Rend.er, or you won't be able to see well!", [{id: 2, amt: 1}],
          [{enemy: BasicEnemy, delay: 100, amount: 10}]),
      new Level("Corruption", "Something doesn't feel right...", [],
          [{enemy: Corrupter, delay: 1, amount: 1000}]),
      new Level("Help", "Something's going terribly wro∂˙ˆ¨©œˆ¨∆˜ß∆å˜…", [{id: 3, amt: 1}, {id: 2, amt: 1}],
          [{enemy: BasicMovingEnemy, delay: 100, amount: 10}, {enemy: Corrupter, delay: 1, amount: 50}]),
      new Level("#?*!", "˙∫∑¬œ∆˚˜≥˚≤µ…¬˚ß≥˜deselect¬≥˚µ¬…", [{id: 3, amt: 1}],
          [{enemy: BasicShootingEnemy, delay: 50, amount: 5}, {enemy: BasicMovingEnemy, delay: 50, amount: 5},
             {enemy: Corrupter, delay: 1, amount: 100}, {enemy: BasicShootingEnemy, delay: 100, amount: 10}]),
      new Level("W∂ˆ†", "I çån ©´† TH®øø!", [{id: 4, amt: 1}],
          [{enemy: BasicShootingEnemy, delay: 10, amount: 15}, {enemy: Corrupter, delay: 5, amount: 100}]),
      new Level("Listen!", "for (var = 0;  < array.length; ++) {var o = array[];}", [{id: 5, amt: 1}],
          [{enemy: TankEnemy, delay: 50, amount: 5}, {enemy: SuperCorrupter, delay: 2, amount: 50},
             {enemy: TankEnemy, delay: 50, amount: 5}, {enemy: SuperCorrupter, delay: 2, amount: 50}]),
      new Level("i'M Getng", "Through! We're ˜∂∆˚∑˜¬ß    ˆ¨œß∆ß  ßœøˆ", [{id: 4, amt: 1}],
          [{enemy: BasicShootingEnemy, delay: 50, amount: 5}, {enemy: BasicMovingEnemy, delay: 50, amount: 5},
             {enemy: Corrupter, delay: 1, amount: 100}, {enemy: BasicShootingEnemy, delay: 100, amount: 10}]),
      new Level("Okay", "˙∫∑¬œ∆˚˜≥˚≤µ…¬˚ß≥˜deselect¬≥˚µ¬…", [{id: 3, amt: 1}],
          []),
      new Level("#?*!", "˙∫∑¬œ∆˚˜≥˚≤µ…¬˚ß≥˜deselect¬≥˚µ¬…", [{id: 3, amt: 1}],
          []),
      new Level("#?*!", "˙∫∑¬œ∆˚˜≥˚≤µ…¬˚ß≥˜deselect¬≥˚µ¬…", [{id: 3, amt: 1}],
          []),
      new Level("#?*!", "˙∫∑¬œ∆˚˜≥˚≤µ…¬˚ß≥˜deselect¬≥˚µ¬…", [{id: 3, amt: 1}],
          []),
      new Level("Final Battle", "Stop the Space Corrupter!", [],
           [{enemy: KingCorrupter, delay: 5, amount: 1}])
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

function Level(title, message, unlock, waves) {
   this.title = title;
   this.message = message;
   this.unlock = unlock;
   this.waves = waves;
}

Level.prototype.getInfo = function() {
   var waves = [];
   this.waves.forEach(function(wave) {
      waves.push({enemy: wave.enemy, delay: wave.delay, amount: wave.amount});
   });

   return {waves: waves};
};