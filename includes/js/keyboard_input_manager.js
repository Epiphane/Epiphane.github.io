function KeyboardInputManager() {
   this.events = {};
   //           up     right  down   left   fire
   this.keys = [false, false, false, false, false];

   this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
   if (!this.events[event]) {
      this.events[event] = [];
   }
   this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
   var callbacks = this.events[event];
   if (callbacks) {
      callbacks.forEach(function (callback) {
         callback(data);
      });
   }
};

KeyboardInputManager.prototype.listen = function () {
   var self = this;

   var map = {
      32: 4, // Space
      38: 0, // Up
      39: 1, // Right
      40: 2, // Down
      37: 3, // Left
      75: 0, // Vim up
      76: 1, // Vim right
      74: 2, // Vim down
      72: 3, // Vim left
      87: 0, // W
      68: 1, // D
      83: 2, // S
      65: 3  // A
   };

   document.addEventListener("keydown", function (event) {
      var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
          event.shiftKey;
      var mapped    = map[event.which];

      if (!modifiers) {
         if (mapped !== undefined) {
            event.preventDefault();
            self.keys[mapped] = true;
         }

         if (event.which == 80) {
            self.emit("pause", 80);
         }
      }
   });

   document.addEventListener("keyup", function (event) {
      var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
          event.shiftKey;
      var mapped    = map[event.which];

      if (!modifiers) {
         if (mapped !== undefined) {
            event.preventDefault();
            self.keys[mapped] = false;
         }
      }
   });

   var run = document.querySelector(".run-button");
   run.addEventListener("click", this.runProgram.bind(this));
};

KeyboardInputManager.prototype.runProgram = function (event) {
   event.preventDefault();
   this.emit("runProgram");
};