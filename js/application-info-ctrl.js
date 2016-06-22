angular.module("UiIntro").controller("AppInfoController", function($scope, $http) {
		
		$scope.getAppInfoClass = function() {
			if ($scope.isAppInfoVisible == true) {
				return 'half-height';
			} else {
				return 'no-height';
			}
		};
	
	}
);