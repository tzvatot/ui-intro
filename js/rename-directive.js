angular.module("UiIntro").directive('renameDirective', function() {
    return {
        restrict: 'E',
        scope: {
            name: '=',
            renameFunc: '=' // TODO: check '&'
        },
        templateUrl: 'rename-template.html',
        controller: function ($scope) {
            var editing = false;
            $scope.newName = $scope.name;

            $scope.isEditing = function() {
                return editing;
            };

            $scope.setEditing = function(newMode) {
                editing = newMode;
                console.log("setting editing to ", newMode);
            };

            $scope.rename = function() {
                $scope.renameFunc($scope.newName);
                editing = false;
            };

            $scope.cancelRename = function() {
                editing = false;
                $scope.newName = $scope.name;
            };

            $scope.getEditingClass = function() {
              if (editing) {
                  return 'input-editable';
              }  else {
                  return 'input-not-editable';
              }
            };

        }
    };
});
