angular.module("UiIntro", [])
	.controller("AppsController", function($scope, $http) {
		$scope.apps = [];
		
		$scope.getAction = function (status) {
			if (status === 'Running') {
				return 'Stop';
			} else if (status === 'Stopped') {
				return 'Start';
			} else {
				return 'Start';
			}
		};
		
		$scope.getStatusClass = function (status) {
			return 'status-' + status.toLowerCase();;
		};
		
		$scope.refreshApps = function() {
			$http({
				method: 'GET',
				url: '/services/applications',
				username : 'ravello@ravello.com',
				password : 'ravello'
			}).then(function successCallback(response) {
				$scope.apps = $scope.parseApps(response.data);
			}, function errorCallback(response) {
				console.log(response);
			});
		};
		
		$scope.parseApps = function (fullApps) {
			var parsedApps = [];
			for (i = 0; i < fullApps.length; i++) {
				var fullApp = fullApps[i];
				var app = { 
						name: $scope.formatName(fullApp.name), 
						owner: fullApp.owner,
						created: $scope.formatDate(fullApp.creationTime),
						status: $scope.getStatusFromApp(fullApp),
						id: fullApp.id
				};
				parsedApps.push(app);
			}
			return parsedApps;
		};
		
		$scope.getStatusFromApp = function (fullApp) {
			var deployment = fullApp.deployment;
			if (typeof deployment != 'undefined') {
				var totalErrorVms = deployment.totalErrorVms;
				if (totalErrorVms > 0) {
					return 'Error';
				} else {
					var totalActiveVms = deployment.totalActiveVms;
					if (totalActiveVms > 0) {
						return 'Running';
					} else {
						return 'Stopped';
					}
				}
			} else {
				return 'Stopped';
			}
		};
		
		$scope.formatName = function (name) {
			return name.replace(new RegExp('<', 'g'), '&lt;').replace(new RegExp('>', 'g'), '&gt;');
		};

		$scope.formatDate = function (epoch) {
			return new Date(epoch).toLocaleDateString('en-GB', {  
			    day : 'numeric',
			    month : 'short',
			    year : 'numeric'
			}).split(' ').join('-');
		};
		
		$scope.showAppInfo = function () {
			// TODO
			alert('TODO: implement');
		};
		
		(function init() {
	        $scope.refreshApps();
	    })();
		
	}
);
