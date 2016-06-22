angular.module("UiIntro").controller("AppInfoController", function ($scope, $http, ApplicationStore, CommonUtil) {

        $scope.vms = [];

        $scope.$watch('selectedApp', function (newValue, oldValue) {
            if (oldValue === newValue || !$scope.selectedApp) {
                return;
            }
            var appId = $scope.selectedApp.id;
            ApplicationStore.getApplication(appId).then(function (fullApp) {
                $scope.vms = parseVms(fullApp);
            });
        });

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

    }
);