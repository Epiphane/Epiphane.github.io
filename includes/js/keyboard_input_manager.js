function KeyboardInputManager() {
   this.events = {};

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

   document.addEventListener("keydown", function (event) {
      //if (event.which === 32) self.go.bind(self)(event);
   });

   var run = document.querySelector(".run-button");
   run.addEventListener("click", this.runProgram.bind(this));
};

KeyboardInputManager.prototype.runProgram = function (event) {
   event.preventDefault();
   this.emit("runProgram");
};