angular.module("UiIntro").directive('renameDirective', function() {
    return {
        restrict: 'E',
        scope: {
            name: '=',
            renameFunc: '='
        },
        templateUrl: 'rename-template.html',
        controller: function ($scope) {
            var editing = false;

            $scope.isEditing = function() {
                console.log("editing = ", editing);
                return editing;
            };

            $scope.setEditing = function(newMode) {
                console.log("setting 'editing' to ", editing);
                editing = newMode;
            };

            $scope.rename = function() {
                console.log('renaming', $scope.name);
                $scope.renameFunc();
                editing = false;
            };

            $scope.cancelRename = function() {
                editing = false;
            };

            $scope.getEditingClass = function() {
              if (editing) {
                  return 'input-editable';
              }  else {
                  return 'input-not-editable';
              }
            };

            // $scope.$watch('name',function (newValue, oldValue) {
            //     if (newValue === oldValue) {
            //         return;
            //     }
            //     console.log("new selected app", $scope.name);
            // });
        }
    };
});
