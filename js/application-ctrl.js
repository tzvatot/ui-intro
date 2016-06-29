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

        $scope.getStatusClass = AppUtil.getStatusClass;

        $scope.refreshApps = function() {
            ApplicationStore.listApplications().then(function (appList) {
                $scope.apps = AppUtil.parseApps(appList);
            });
        };

        $scope.showCreateAppDialog = function(app) {
            var modalInstance = $uibModal.open({
                templateUrl : 'create-new-app-modal.html',
                controller : 'CreateAppModalCtrl'
            });

            modalInstance.result.then(function(appDetails) {
                var name = appDetails.name;
                var description = appDetails.description;
                createNewApp(name, description);
            }, function() {
//				console.log("dismissing modal");
            });
        };

        $scope.renameSelectedApp = function(newName) {
            renameApp($scope.selectedApp.id, newName);
        };

        function createNewApp(name, description) {
            console.log("not implemented yet", name, description);
        }

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
            $scope.refreshApps();
        }

        init();
    }

);
