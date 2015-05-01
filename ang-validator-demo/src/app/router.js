(function () {
	'use strict';

angular.module('angValidatorDemo')
	.config(function ($stateProvider, $urlRouterProvider) {
		$stateProvider
			.state('main', {
				url: '/',
				templateUrl: 'app/components/main/main.template.html',
				controller: 'MainCtrl',
				controllerAs: 'mainCtrl'
			});

		$urlRouterProvider.otherwise('/');
	});
}());