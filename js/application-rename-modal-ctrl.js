angular.module("UiIntro").controller('RenameAppModalCtrl', function ($scope, $uibModalInstance) {
	  $scope.newAppName = '';
	  
	  $scope.ok = function () {
	    $uibModalInstance.close($scope.newAppName);
	  };

	  $scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };
});
