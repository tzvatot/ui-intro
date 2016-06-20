var uiIntroApp = angular.module("UiIntro", []);

uiIntroApp.controller("AppsController", function($scope, $http) {
		$scope.apps = [];
		$scope.vms = [];
		$scope.newAppName = '';
		
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
			if (!status) {
				return '';
			}
			return 'status-' + status.toLowerCase();
		};
		
		$scope.refreshApps = function() {
			$http({
				method: 'GET',
				url: '/services/applications',
				async: false
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
						created: $scope.formatDate(parseInt(fullApp.creationTime)),
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
		
		$scope.isAppInfoVisible = false;
		
		$scope.showAppInfo = function(app) {
			$scope.isAppInfoVisible = true;
//			$scope.closeRenameAppDialog();
			$scope.selectedApp = app;
			$scope.refreshVms(app.id);
		};
		
		$scope.refreshVms = function(appId) {
			$scope.vms = [];
			$scope.getUpdatedApp(appId, function(fullApp) {
				$scope.vms = $scope.parseVms(fullApp);
			});
		};
		
		$scope.getUpdatedApp = function(appId, callback) {
			$http({
				method: 'GET',
				url: '/services/applications/' + appId,
			}).then(function successCallback(response) {
				callback(response.data);
			}, function errorCallback(response) {
				console.log(response);
				throw response;
			});
		};
		
		$scope.parseVms = function(fullApp) {
			var parsedVms = [];
			if (fullApp.deployment && fullApp.deployment.vms) {
				var vmList = fullApp.deployment.vms;
				for (i = 0; i < vmList.length; i++) {
					var fullVm = vmList[i];
					var vm = { 
							name: $scope.formatName(fullVm.name), 
							publishTime: $scope.formatDate(parseInt(fullVm.firstTimePublished)),
							status: $scope.getStatusFromVm(fullVm),
							id: fullVm.id
					};
					parsedVms.push(vm);
				}
			}
			if (fullApp.design && fullApp.design.vms) {
				var vmList = fullApp.design.vms;
				for (i = 0; i < vmList.length; i++) {
					var fullVm = vmList[i];
					var vm = { 
							name: $scope.formatName(fullVm.name), 
							publishTime: '',
							status: 'Draft',
							id: fullVm.id
					};
					parsedVms.push(vm);
				}
			}
			return parsedVms;
		}
		
		$scope.getStatusFromVm = function(fullVm) {
			var status = fullVm.state.toLowerCase();
			if (status === 'error_deploy') {
				status = 'error';
			} else if (status === 'started') {
				status = 'running';
			}
			return status[0].toUpperCase() + status.substr(1).toLowerCase();
		};
		
		$scope.getAppListClass = function() {
			if ($scope.isAppInfoVisible == true) {
				return 'half-height';
			} else {
				return 'full-height';
			}
		};
		
		$scope.showRenameAppDialog = function(app) {
			$scope.openRenameAppDialog();
			$scope.selectedApp = app;
		};
		
		$scope.openRenameAppDialog = function() {
			$('.app-rename-dialog').dialog("open");
		};
		
		$scope.closeRenameAppDialog = function() {
			$('.app-rename-dialog').dialog("close");
		};
		
		$scope.renameApp = function(newAppName) {
			$scope.getUpdatedApp($scope.selectedApp.id, function(fullApp){
				fullApp.name = newAppName;
				$scope.updateApp(fullApp);
			});
		};
		
		$scope.updateApp = function(fullApp) {
			$http({
				method: 'PUT',
				url: '/services/applications/' + app.id,
				async: false,
				data: JSON.stringify(fullApp),
				dataType : 'json'
			}).then(function successCallback(response) {
				$scope.refreshApps();
			}, function errorCallback(response) {
				console.log(response);
			});
		};
		
		function init() {
			$http.defaults.headers.common['Authorization'] = 'Basic cmF2ZWxsb0ByYXZlbGxvLmNvbTpyYXZlbGxv'; 
	        $scope.refreshApps();
	    }
		
		init();		
	}
	
);

uiIntroApp.controller("AppInfoController", function($scope, $http) {
		
		$scope.getAppInfoClass = function() {
			if ($scope.isAppInfoVisible == true) {
				return 'half-height';
			} else {
				return 'no-height';
			}
		};
	
	}
);
