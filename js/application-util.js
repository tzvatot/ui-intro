angular.module("UiIntro").factory('AppUtil', function(CommonUtil) {

    var factory = {};

    factory.parseApps = function (fullApps) {
        var parsedApps = [];
        for (i = 0; i < fullApps.length; i++) {
            var fullApp = fullApps[i];
            var app = parseApp(fullApp);
            parsedApps.push(app);
        }
        return parsedApps;
    };

    function parseApp(fullApp) {
        return {
            name: CommonUtil.formatName(fullApp.name),
            owner: fullApp.owner,
            created: CommonUtil.formatDate(parseInt(fullApp.creationTime)),
            status: getStatusFromApp(fullApp),
            id: fullApp.id
        };
    }

    function getStatusFromApp(fullApp) {
        var deployment = fullApp.deployment;
        if (deployment) {
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
    }

    return factory;

});
