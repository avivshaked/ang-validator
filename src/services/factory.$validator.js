(function () {
	'use strict';

	var _errHead = 'ang-validator: factory-init: $validator: ';

	angular.module('ang-validator')
		.factory('$validator', [
			Validator
		]);

	function Validator () {
		function _validations () {
			if (!window.validator ) {
				throw new ReferenceError(_errHead + 'No instance of validator object found. Please make sure you have referenced the file. (' +
				'<script type="text/javascript" src="[path to component/]validator.min.js"></script>)');
			}

			if (!(window.validator.version && window.validator.extend && window.validator.isHexColor)) {
				throw new TypeError(_errHead + '"validator" instance found is not chriso\'s validator.js object. Please make sure to load the correct validator. https://github.com/chriso/validator.js');
			}

			var version = window.validator.version.split('.').map(function (ver) { return parseInt(ver); });

			if(version[0] !== 3 || version[1] < 38) {
				throw new RangeError(_errHead + '"validator" instance found is not the required version. Required 3, sub version 38 and up.');
			}
		}

		function _init () {
			_validations();
		}

		_init();

		return validator;
	}


}());