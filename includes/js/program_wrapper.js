/**
 * Created by ThomasSteinke on 3/24/14.
 */

function ProgramWrapper(program, position, cells) {
   this.program = program;
   this.position = position;
   this.cells = cells;
   this.valid = true;

   var width = this.program.map[0].length;
   var height = this.program.map.length;

   this.div = document.createElement("div")
   this.div.classList.add("program-back");
   this.div.classList.add("program-back-valid");
   this.div.style.setProperty("top", (position.y * 55 + 3) + "px")
   this.div.style.setProperty("left", (position.x * 55 + 3) + "px")
   this.div.style.setProperty("width", (width * 55 - 1) + "px")
   this.div.style.setProperty("height", (height * 55 - 1) + "px")

   var tagline = document.createElement("div")
   tagline.classList.add("tagline")
   tagline.innerHTML = this.program.name

   var req = document.createElement("div")
   req.classList.add("badge")
   req.innerHTML = this.program.required
   tagline.appendChild(req)

   this.div.appendChild(tagline)
}

ProgramWrapper.prototype.getDiv = function() {
   return this.div;
}

ProgramWrapper.prototype.testValid = function() {
   var score = 0;

   this.cells.forEach(function(cell) {
      score += cell.active ? 1 : 0;
   });

   if(this.valid ^ score >= this.program.required) {
      this.valid = (score >= this.program.required);

      if(this.valid) {
         this.div.classList.remove("program-back-invalid");
         this.div.classList.add("program-back-valid");
      }
      else {
         this.div.classList.remove("program-back-valid");
         this.div.classList.add("program-back-invalid");
      }
   }
}

ProgramWrapper.prototype.setAttribute = function(attributes) {
   if(this.valid) {
      if(!attributes[this.program.id])
         attributes[this.program.id] = 1;
      else
         attributes[this.program.id]++;
   }
}