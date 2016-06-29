angular.module("UiIntro").controller('CreateAppModalCtrl', function ($scope, $uibModalInstance) {

	$scope.name = '';
	$scope.description = '';

	$scope.ok = function () {
		$uibModalInstance.close({ name: $scope.name, description: $scope.description });
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});
