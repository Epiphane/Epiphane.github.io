function ProgramCtrl($scope) {
   $scope.programs = [];

   $scope.programSelectedCallback = function() { console.log("ow!") };

   $scope.gridSize = function(program) {
      var l = program.map.length < 3 ? 3 : program.map.length;
      var w = program.map[0].length < 3 ? 3 : program.map[0].length;
      return l + 'x' + w;
   };

   $scope.attr = function(boolean, on, off) {
      if(boolean)
         return on;
      else
         return off;
   };

   $scope.select = function(program) {
      var toSelect = $scope.copy[program.$index];
      $scope.deselect()

      toSelect.selected = true;
      $scope.programSelectedCallback(toSelect)
   };

   $scope.deselect = function() {
      angular.forEach($scope.programs, function(program) {
         program.selected = false;
      })
   };

   $scope.setup = function(array) {
      $scope.copy = [];
      array.forEach(function(obj) {
         if(obj.available)
            $scope.copy.push(obj);
      });
      return $scope.copy;
   }
}