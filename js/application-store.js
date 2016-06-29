angular.module("UiIntro").factory('ApplicationStore', function($http) {
	
	var factory = {};
	

	factory.listApplications = function() {
		return $http.get('/services/applications').then(function(response) {
			return response.data;
		}).catch(function(e) {
			console.log(e)
		});
	}
	
	factory.getApplication = function(appId) {
		return $http.get('/services/applications/' + appId).then(function(response) {
			return response.data;
		}).catch(function(e) {
			console.log(e)
		});
	}
	
	factory.updateApplication = function(fullApp) {
		return $http.put('/services/applications/' + fullApp.id, JSON.stringify(fullApp)).then(function(response) {
			return response.data;
		}).catch(function(e) {
			console.log(e)
		});
	}

	factory.createApplication = function(name, description) {
		var data = {name: name, description: description};
		return $http.post('/services/applications', JSON.stringify(data)).then(function(response) {
			return response.data;
		}).catch(function(e) {
			console.log(e)
		});
	}

	function init() {
		$http.defaults.headers.common['Authorization'] = 'Basic cmF2ZWxsb0ByYXZlbGxvLmNvbTpyYXZlbGxv';
	}

	init();

	return factory;
});
