angular.module("UiIntro").factory('CommonUtil', function() {
	
	var factory = {};
	
	factory.formatName = function(name) {
		return name.replace(new RegExp('<', 'g'), '&lt;').replace(new RegExp('>', 'g'), '&gt;');
	};

	factory.formatDate =  function(epoch) {
		return new Date(epoch).toLocaleDateString('en-GB', {
			day : 'numeric',
			month : 'short',
			year : 'numeric'
		}).split(' ').join('-');
	};


	return factory;
});
