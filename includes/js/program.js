function ProgramCtrl($scope) {
   $scope.programs = [
      {id: 0, name: 'Rend.er', description: 'Visibility', selected: false, required: 8,
         map: [[0, 0, 1, 1],
               [0, 0, 1, 1],
               [1, 1, 0, 0],
               [1, 1, 0, 0]]},
      {id: 1, name: 'Tim.er', description: 'Realtime Movement', selected: false, required: 3,
         map: [[0, 1, 0],
               [0, 1, 0],
               [0, 1, 0]]},
      {id: 2, name: 'Sp.read', description: 'Bullet Spread', selected: false, required: 5,
         map: [[0, 1, 0],
               [0, 0, 1],
               [1, 1, 1]]},
      {id: 3, name: 'Gl.ue', description: 'Slower Enemies', selected: false, required: 6,
         map: [[0, 1, 1, 0],
               [1, 0, 0, 1],
               [0, 1, 1, 0]]}];

   $scope.programSelectedCallback = function() { console.log("ow!") };

   $scope.gridSize = function(program) {
      return program.map.length + 'x' + program.map[0].length;
   }

   $scope.attr = function(boolean, on, off) {
      if(boolean)
         return on;
      else
         return off;
   }

   $scope.select = function(program) {
      var toSelect = $scope.programs[program.$index];
      $scope.deselect()

      toSelect.selected = true;
      $scope.programSelectedCallback(toSelect)
   }

   $scope.deselect = function() {
      angular.forEach($scope.programs, function(program) {
         program.selected = false;
      })
   }
}