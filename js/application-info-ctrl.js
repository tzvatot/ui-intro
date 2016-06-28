angular.module("UiIntro").controller("AppInfoController", function ($scope, $http, $stateParams, ApplicationStore, AppUtil, CommonUtil) {

        $scope.vms = [];
        $scope.app = null;
        $scope.selectedVm = null;
        var modelApp = null;

        function init() {
            refresh()
        }

        function parseVms(fullApp) {
            var parsedVms = [];
            if (fullApp.design && fullApp.design.vms) {
                parsedVms = _.map(fullApp.design.vms, function (fullVm) {
                    var deploymentVm = getDeploymentVm(fullApp, fullVm.id);
                    console.log('deploymentVm:', deploymentVm);
                    return {
                        name: CommonUtil.formatName(fullVm.name),
                        publishTime: getPublishTime(deploymentVm),
                        status: getVmStatus(deploymentVm),
                        id: fullVm.id
                    };
                });
            }
            return parsedVms;
        }

        function getDeploymentVm(fullApp, vmId) {
            var deployment = fullApp.deployment;
            if (deployment && deployment.vms) {
                return _.find(deployment.vms, {id: vmId});
            }
            return undefined;
        }

        function getPublishTime(deploymentVm) {
            if (deploymentVm) {
                return CommonUtil.formatDate(parseInt(deploymentVm.firstTimePublished));
            } else {
                return '';
            }
        }

        function getVmStatus(deploymentVm) {
            if (deploymentVm) {
                return getStatusFromDeploymentVm(deploymentVm);
            } else {
                return 'Draft';
            }
        }

        function getStatusFromDeploymentVm(depVm) {
            var status = depVm.state.toLowerCase();
            if (status === 'error_deploy') {
                status = 'error';
            } else if (status === 'started') {
                status = 'running';
            }
            return status[0].toUpperCase() + status.substr(1).toLowerCase();
        }

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
                $scope.app = AppUtil.parseApps([ fullApp ])[0];
                $scope.vms = parseVms(fullApp);
            });
        }



        init();

    }
);