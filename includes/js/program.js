function ProgramCtrl($scope) {
   $scope.programs = [
      {name: 'Rend.er', description: 'Visibility', selected: false, required: 6,
         map: [[0, 0, 1, 1],
               [0, 0, 1, 1],
               [1, 1, 0, 0],
               [1, 1, 0, 0]]},
      {name: 'Tim.er', description: 'Realtime Movement', selected: false, required: 3,
         map: [[0, 1, 0],
               [0, 1, 0],
               [0, 1, 0]]}];

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