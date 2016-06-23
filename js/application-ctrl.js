angular.module("UiIntro").controller("AppsController", function($scope, $http, $uibModal, ApplicationStore, CommonUtil) {
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
                    name: CommonUtil.formatName(fullApp.name),
                    owner: fullApp.owner,
                    created: CommonUtil.formatDate(parseInt(fullApp.creationTime)),
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

        $scope.isAppInfoVisible = false;

        $scope.setSelectedApp = function(app) {
            $scope.selectedApp = app;
        };

        $scope.showAppInfo = function(app) {
            $scope.isAppInfoVisible = true;
            $scope.selectedApp = app;
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
//				console.log("dismissing modal");
            });
        };

        $scope.renameSelectedApp = function(newName) {
            console.log("renaming: ", $scope.selectedApp.id, newName);
            renameApp($scope.selectedApp.id, newName);
        };

        function renameApp(appId, newAppName) {
            ApplicationStore.getApplication(appId).then(function(fullApp){
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