angular.module("UiIntro", [])
	.controller("AppsController", function($scope) {
		$scope.apps = [
		               {
		               	id: 1,
		               	name: 'app1',
		               	status: 'Running',
		               	owner: 'Elad',
		               	created: '1/1/2016'
		               },
		               {
		               	id: 2,
		               	name: 'app2',
		               	status: 'Stopped',
		               	owner: 'Yaniv',
		               	created: '2/1/2016'
		               },
		               {
		               	id: 3,
		               	name: 'app3',
		               	status: 'Error',
		               	owner: 'Noam',
		               	created: '3/1/2016'
		               },
		               {
		               	id: 4,
		               	name: 'app4',
		               	status: 'Running',
		               	owner: 'Daniel',
		               	created: '4/1/2016'
		               }
		           ];
		
		$scope.getAction = function (status) {
			if (status === 'Running') {
				return 'Stop';
			} else if (status === 'Stopped') {
				return 'Start';
			} else {
				return 'Start';
			}
		};
	}
);
