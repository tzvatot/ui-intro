angular.module("UiIntro").factory('ApplicationStore', function($http) {
	
	var factory = {};
	

	factory.listApplications = function(callback) {
		return $http.get('/services/applications').then(function(response) {
			return response.data;
		}).catch(function(e) {
			console.log(e)
		});
	}
	
	factory.getApplication = function(appId, callback) {
		$http({
			method: 'GET',
			url: '/services/applications/' + appId
		}).then(function successCallback(response) {
			callback(response.data);
		}, function errorCallback(response) {
			console.log(response);
			throw response;
		});
	}

	return factory;
});
