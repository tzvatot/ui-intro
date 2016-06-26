angular.module("UiIntro").directive('renameDirective', function() {

    var letBtnHandleClick = false;

    return {
        restrict: 'E',
        scope: {
            name: '=',
            renameFunc: '=' // TODO: check '&'
        },
        templateUrl: 'rename-template.html',


        link: function(scope, element) {
            element.find('input').bind('blur', function (e) {
                console.log('blur');
                if (letBtnHandleClick) {
                    console.log('IGNORE blur');
                    letBtnHandleClick = false;
                    element.find('input').focus();
                    return;
                }

                scope.$apply(function () {
                    scope.cancelRename();
                });
            });
        },

        controller: function ($scope) {
            $scope.editing = false;
            $scope.newName = $scope.name;

            $scope.isEditing = function() {
                return  $scope.editing;
            };

            $scope.setEditing = function(newMode) {
                $scope.editing = newMode;
            };

            $scope.rename = function() {
                console.log("renaming");
                $scope.renameFunc($scope.newName);
                $scope.editing = false;
            };

            $scope.cancelRename = function() {
                $scope.newName = $scope.name;
                console.log("canceling: ", $scope.newName);
                $scope.editing = false;
            };


            $scope.getEditingClass = function() {
              if ($scope.editing) {
                  return 'input-editable';
              }  else {
                  return 'input-not-editable';
              }
            };


            $scope.handleMouseDownOnBtn = function() {
                console.log("setting letBtnHandleClick=true");
                letBtnHandleClick = true;
            };

            $scope.handleMouseUpOnBtn = function() {
                console.log("setting letBtnHandleClick=false");
                letBtnHandleClick = false;
            };

        }
    };
});
