(function () {
	'use strict';
	angular.module('angValidatorDemo')
		.directive('angNavBar', [
			'$log',
			angNavBar
		]);

	function angNavBar ($log) {

		function navBarLink () {
		}

		function NavBarCtrl () {
		}

		return {
			restrict    : 'E',
			link        : navBarLink,
			controller  : NavBarCtrl,
			controllerAs: 'navBarCtrl',
			templateUrl : 'app/components/main/directives/angNavBar/angNavBar.template.html'
		};
	}
}());