(function () {
	'use strict';

	angular.module('angValidatorDemo')
		.controller('MainCtrl', [
			'$log',
			MainCtrl
		]);

	function MainCtrl ($log) {
		// Dependencies
		this.$log = $log;

		this.init();
	}

	MainCtrl.prototype = {
		init: init
	};


	//===============================================
	//          FUNCTIONS DECLARATIONS              =
	//===============================================

	function init () {
		/*jshint validthis:true */
		this.$log.debug('MainCtrl: init: invoked.');
	}
}());