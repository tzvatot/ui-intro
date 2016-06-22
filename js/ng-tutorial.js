var uiIntroApp = angular.module("UiIntro", ['ngAnimate', 'ui.bootstrap']);

uiIntroApp.controller("AppsController", function($scope, $http, $uibModal, ApplicationStore) {
		$scope.apps = [];
		$scope.vms = [];
		
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
			ApplicationStore.listApplications().then(function (appList) {
				$scope.apps = parseApps(appList);
			});
		};
		
		function parseApps (fullApps) {
			var parsedApps = [];
			for (i = 0; i < fullApps.length; i++) {
				var fullApp = fullApps[i];
				var app = { 
						name: formatName(fullApp.name), 
						owner: fullApp.owner,
						created: formatDate(parseInt(fullApp.creationTime)),
						status: getStatusFromApp(fullApp),
						id: fullApp.id
				};
				parsedApps.push(app);
				if ($scope.selectedApp && $scope.selectedApp.id === app.id) {
					$scope.selectedApp = app;
				}
			}
			return parsedApps;
		};
		
		function getStatusFromApp(fullApp) {
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
		
		function formatName(name) {
			return name.replace(new RegExp('<', 'g'), '&lt;').replace(new RegExp('>', 'g'), '&gt;');
		}

		function formatDate(epoch) {
			return new Date(epoch).toLocaleDateString('en-GB', {  
			    day : 'numeric',
			    month : 'short',
			    year : 'numeric'
			}).split(' ').join('-');
		}
		
		$scope.isAppInfoVisible = false;
		
		$scope.showAppInfo = function(app) {
			$scope.isAppInfoVisible = true;
			$scope.selectedApp = app;
			$scope.refreshVms(app.id);
		};
		
		$scope.refreshVms = function(appId) {
			$scope.vms = [];
			ApplicationStore.getApplication(appId).then(function(fullApp) {
				$scope.vms = parseVms(fullApp);
			});
		};
		
		function parseVms(fullApp) {
			var parsedVms = [];
			
			if (fullApp.deployment && fullApp.deployment.vms) {
				parsedVms = _.map(fullApp.deployment.vms, function(fullVm) {
					return { 
						name: formatName(fullVm.name), 
						publishTime: formatDate(parseInt(fullVm.firstTimePublished)),
						status: getStatusFromVm(fullVm),
						id: fullVm.id
					};
				});
			}
			
			
			if (fullApp.design && fullApp.design.vms) {
				var vmList = fullApp.design.vms;
				for (i = 0; i < vmList.length; i++) {
					var fullVm = vmList[i];
					var vm = { 
							name: formatName(fullVm.name), 
							publishTime: '',
							status: 'Draft',
							id: fullVm.id
					};
					parsedVms.push(vm);
				}
			}
			return parsedVms;
		}
		
		function getStatusFromVm(fullVm) {
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
			var modalInstance = $uibModal.open({
				templateUrl : 'rename-app-dialog-modal.html',
				controller : 'RenameAppModalCtrl'				
			});

			modalInstance.result.then(function(newAppName) {
				renameApp(app.id, newAppName);
			}, function() {
				console.log("dismissing");
			});
		};
						
		function renameApp(appId, newAppName) {
			ApplicationStore.getApplication(appId, function(fullApp){
				fullApp.name = newAppName;
				updateApp(fullApp);
			});
		}
		
		function updateApp(fullApp) {
			ApplicationStore.updateApplication(fullApp).then(function (){
				$scope.refreshApps();
			});
		}

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

uiIntroApp.controller('RenameAppModalCtrl', function ($scope, $uibModalInstance) {
	  $scope.newAppName = '';
	  
	  $scope.ok = function () {
	    $uibModalInstance.close($scope.newAppName);
	  };

	  $scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };
});

