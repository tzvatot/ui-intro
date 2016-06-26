angular.module("UiIntro").controller("AppInfoController", function ($scope, $http, $stateParams, ApplicationStore, AppUtil, CommonUtil) {

        $scope.vms = [];
        $scope.selectedApp;

        function parseVms(fullApp) {
            var parsedVms = [];

            if (fullApp.deployment && fullApp.deployment.vms) {
                parsedVms = _.map(fullApp.deployment.vms, function (fullVm) {
                    return {
                        name: CommonUtil.formatName(fullVm.name),
                        publishTime: CommonUtil.formatDate(parseInt(fullVm.firstTimePublished)),
                        status: getStatusFromVm(fullVm),
                        id: fullVm.id
                    };
                });
            }


            if (fullApp.design && fullApp.design.vms) {
                _.forEach(fullApp.design.vms, function (fullVm) {
                    var vm = {
                        name: CommonUtil.formatName(fullVm.name),
                        publishTime: '',
                        status: 'Draft',
                        id: fullVm.id
                    };
                    parsedVms.push(vm);
                });
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

        $scope.getAppInfoClass = function () {
            if ($scope.isAppInfoVisible == true) {
                return 'half-height';
            } else {
                return 'no-height';
            }
        };

        $scope.renameVm = function(newName) {
            console.log("renaming vm not implemented yet ", newName);
        };

        function init() {
            ApplicationStore.getApplication($stateParams.appId).then(function (fullApp) {
                $scope.selectedApp = AppUtil.parseApps([ fullApp ]);
                $scope.vms = parseVms(fullApp);
            });
        }

        init();

    }
);