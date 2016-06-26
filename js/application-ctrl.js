angular.module("UiIntro").controller("AppsController", function($scope, $http, $uibModal, ApplicationStore, AppUtil) {
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
                $scope.apps = AppUtil.parseApps(appList);
            });
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
