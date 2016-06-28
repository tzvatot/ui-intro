angular.module("UiIntro").controller("AppInfoController", function ($scope, $http, $stateParams, ApplicationStore, AppUtil, CommonUtil) {

        $scope.vms = [];
        $scope.selectedApp = null;
        $scope.selectedVm = null;
        var modelApp = null;

        function init() {
            refresh()
        }


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

        $scope.getStatusClass = function (status) {
            return AppUtil.getStatusClass(status);
        };

        $scope.renameVm = function(newName) {
            var fullVm = _.find(modelApp.design.vms, {id: $scope.selectedVm.id});
            console.log(fullVm);
            fullVm.name = newName;
            console.log('before update: ', modelApp);
            ApplicationStore.updateApplication(modelApp).then(function() {
                console.log(modelApp);
                refresh();
            });
        };

        $scope.setSelectedVm = function(vm) {
            $scope.selectedVm = vm;
        }

        function refresh() {
            ApplicationStore.getApplication($stateParams.appId).then(function (fullApp) {
                modelApp = fullApp;
                $scope.selectedApp = AppUtil.parseApps([ fullApp ])[0];
                $scope.vms = parseVms(fullApp);
            });
        }



        init();

    }
);