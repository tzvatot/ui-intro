var uiIntroApp = angular.module("UiIntro", ['ngAnimate', 'ui.bootstrap', 'ui.router']);

uiIntroApp.config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/applications");

	$stateProvider
		.state('app-list', {
			url: "/applications",
			templateUrl: "app-list.html",
			controller: 'AppsController'
		})
		.state('app-info', {
			url: "/applications/:appId",
			templateUrl: "app-info.html",
			controller: 'AppInfoController'
		})
});

