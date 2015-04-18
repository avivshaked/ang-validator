(function () {
	'use strict';

	angular.module('ang-validator', []);

}());
(function () {
	'use strict';


	angular.module('ang-validator')
		.run([
			'$validator',
			'$validatorBuilder',
			function ($validator, $validatorBuilder) {

				function capitalizeFirstLetter(string) {
					return string.charAt(0).toUpperCase() + string.slice(1);
				}

				function buildValidatorsArray () {
					var methodNames = ['equals', 'contains', 'matches', 'isEmail', 'isURL', 'isFQDN', 'isIP',
						'isAlpha', 'isNumeric', 'isAlphanumeric', 'isBase64', 'isHexadecimal', 'isHexColor', 'isLowercase',
						'isUppercase', 'isInt', 'isFloat', 'isDivisibleBy', 'isNull', 'isLength', 'isByteLength', 'isUUID',
						'isDate', 'isAfter', 'isBefore', 'isIn', 'isCreditCard', 'isISIN', 'isISBN', 'isMobilePhone', 'isJSON',
						'isMultibyte', 'isAscii', 'isFullWidth', 'isHalfWidth', 'isVariableWidth', 'isSurrogatePair', 'isMongoId',
						'isCurrency'];
					return methodNames.map(function (methodName) {
						return {
							directiveName: 'ngv' + capitalizeFirstLetter(methodName),
							validatorName: methodName,
							validator: $validator[methodName]
						};
					});
				}
				$validatorBuilder.buildValidators(buildValidatorsArray());
			}
		]);
}());
(function () {
	'use strict';

	var _errHead = 'ang-validator: factory-init: $validator: ';

	angular.module('ang-validator')
		.factory('$validator', [
			Validator
		])
		.factory('$ValidatorConstructor', function () {
			return Validator;
		});

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
(function () {
	'use strict';
	var _errHead = 'ang-validator: $validatorBuilder: ';


	angular.module('ang-validator')
		.provider('$validatorBuilder', [
			'$compileProvider',
			ValidatorBuilderProvider
		]);

	function ValidatorBuilderProvider ($compileProvider) {

		this.$get = [
			'internalValidation',
			ValidatorBuilderFactory
		];

		function ValidatorBuilderFactory (internalValidation) {

			function ValidatorBuilder () {}

			ValidatorBuilder.prototype = {
				internalValidation: internalValidation,
				$compileProvider: $compileProvider,
				_validateBuildConfig: _validateBuildConfig,
				_validatorDirective : _validatorDirective,
				_validatorLink      : _validatorLink,
				/**
				 *
				 * @param {{directiveName: string, validatorName: string, validator: function}} oConfig
				 * @description
				 * Builds a new validator directive
				 */
				buildValidator      : buildValidator,
				/**
				 *
				 * @param {Array<{directiveName: string, validatorName: string, validator: function}>} arrConfig
				 * @description
				 * Builds multiple new validator directives
				 */
				buildValidators: buildValidators
			};

			return new ValidatorBuilder();


			/**
			 *
			 * @param {{directiveName: string, validatorName: string, validator: function}} oConfig
			 * @private
			 */
			function _validateBuildConfig (oConfig) {
				var _errMsg = _errHead + '_validateBuildConfig: oConfig';
				this.internalValidation.validateObject(oConfig, _errMsg);
				this.internalValidation.validateStringProperty(oConfig, 'directiveName', _errMsg);
				this.internalValidation.validateStringProperty(oConfig, 'validatorName', _errMsg);
				this.internalValidation.validateFunctionProperty(oConfig, 'validator', _errMsg);
			}


			/**
			 *
			 * @param {{directiveName: string, validatorName: string, validator: function}} oConfig
			 * @returns {{restrict: string, require: string, link: function}}
			 * @private
			 */
			function _validatorDirective (oConfig) {
				var self = this;

				return {
					restrict: 'A',
					require : 'ngModel',
					link    : self._validatorLink.bind(self, oConfig)
				};

			}


			/**
			 *
			 * @param {{directiveName: string, validatorName: string, validator: function}} oConfig
			 * @param {object} scope
			 * @param {angular.element} element
			 * @param {object} attr
			 * @param {object} model
			 * @private
			 */
			function _validatorLink (oConfig, scope, element, attr, model) {

				// Add validator
				model.$validators[oConfig.validatorName] = validatorFunc;

				/**
				 *
				 * @param {*} val
				 * @returns {*}
				 * @description
				 * The validator function of the validator directive.
				 * It first verifies that val exists, or that one of the attributes is ngvRequired
				 */
				function validatorFunc (val) {
					if (val || attr.ngvRequired) {
						var arg = scope.$eval(attr[oConfig.directiveName]);
						return oConfig.validator(val, arg);
					}

					return true;
				}
			}


			/**
			 *
			 * @param {{directiveName: string, validatorName: string, validator: function}} oConfig
			 * @description
			 * Builds a new validator directive
			 */
			function buildValidator (oConfig) {
				var self = this;

				// Validate oConfig
				self._validateBuildConfig(oConfig);

				// Declare a new directive
				self.$compileProvider.directive(oConfig.directiveName, self._validatorDirective.bind(self, oConfig));

			}

			/**
			 *
			 * @param {Array<{directiveName: string, validatorName: string, validator: function}>} arrConfig
			 * @description
			 * Builds multiple new validator directives
			 */
			function buildValidators (arrConfig) {
				var self = this;
				var _errMsg = _errHead + 'buildValidators: arrConfig';
				// Validate arr config
				self.internalValidation.validateObject(arrConfig, _errMsg);
				if (!angular.isArray(arrConfig)) {
					throw new TypeError(_errMsg + ' should be an array');
				}

				arrConfig.forEach(function (oConfig) {
					self.buildValidator(oConfig);
				});

			}
		}
	}


}());
(function () {
	'use strict';


	angular.module('ang-validator')
		.service('internalValidation', [
			InternalValidation
		]);

	function InternalValidation () {}

	InternalValidation.prototype = {
		/**
		 *
		 * @param {object} obj
		 * @param {string} errMsg
		 * @param {boolean=} isOptional Defaults to false
		 * @return void
		 * @throws ReferenceError
		 * @description
		 * If the object is not defined and not optional, this method will throw ReferenceError
		 */
		validateObject: validateObject,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @param {boolean=} isOptional Defaults to false
		 * @return void
		 * @throws ReferenceError
		 * @description
		 * If the property on the object does not exist and is not optional, this method will throw ReferenceError
		 */
		validateProperty: validateProperty,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @param {boolean=} canBeEmpty Defaults to false
		 * @return void
		 * @throws TypeError RangeError
		 * @description
		 * If the property on the object is not a string this method will throw TypeError.
		 * If the property on the string is an empty string, and canBeEmpty is not true, this method will throw RangeError
		 */
		validateString: validateString,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @return void
		 * @throws TypeError
		 * @description
		 * If the property on the object is not a function this method will throw TypeError.
		 */
		validateFunction: validateFunction,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @param {boolean=} isOptional Defaults to false
		 * @param {boolean=} canBeEmpty Defaults to false
		 * @description
		 * Validates a string property.
		 */
		validateStringProperty: validateStringProperty,
		/**
		 *
		 * @param {object} obj
		 * @param {string} propName
		 * @param {string} errMsg
		 * @param {boolean=} isOptional Defaults to false
		 * @description
		 * Validates a function property.
		 */
		validateFunctionProperty: validateFunctionProperty
	};

	/**
	 *
	 * @param {object} obj
	 * @param {string} errMsg
	 * @param {boolean=} isOptional Defaults to false
	 * @return void
	 * @throws ReferenceError
	 * @description
	 * If the object is not defined and not optional, this method will throw ReferenceError
	 */
	function validateObject (obj, errMsg, isOptional) {
		isOptional = !!isOptional;

		if (!obj && !isOptional) {
			throw new ReferenceError(errMsg + ' must be provided.');
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @param {boolean=} isOptional Defaults to false
	 * @return void
	 * @throws ReferenceError
	 * @description
	 * If the property on the object does not exist and is not optional, this method will throw ReferenceError
	 */
	function validateProperty (obj, propName, errMsg, isOptional) {
		isOptional = !!isOptional;

		if (angular.isUndefined(obj[propName]) && !isOptional) {
			throw new ReferenceError(errMsg + ' must have a ' + propName + ' property.');
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @param {boolean=} canBeEmpty Defaults to false
	 * @return void
	 * @throws TypeError RangeError
	 * @description
	 * If the property on the object is not a string this method will throw TypeError.
	 * If the property on the string is an empty string, and canBeEmpty is not true, this method will throw RangeError
	 */
	function validateString (obj, propName, errMsg, canBeEmpty) {
		if (!angular.isString(obj[propName])) {
			throw new TypeError(errMsg + propName + ' property must be a string.');
		}

		if (obj[propName] === '' && !canBeEmpty) {
			throw new RangeError(errMsg + propName + ' property must not be an empty string.');
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @return void
	 * @throws TypeError
	 * @description
	 * If the property on the object is not a function this method will throw TypeError.
	 */
	function validateFunction (obj, propName, errMsg) {
		if (!angular.isFunction(obj[propName])) {
			throw new TypeError(errMsg + propName + ' property must be a function.');
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @param {boolean=} isOptional Defaults to false
	 * @param {boolean=} canBeEmpty Defaults to false
	 * @description
	 * Validates a string property.
	 */
	function validateStringProperty (obj, propName, errMsg, isOptional, canBeEmpty) {
		isOptional = !!isOptional;
		canBeEmpty = !!canBeEmpty;
		/*jshint validthis:true */
		this.validateProperty(obj, propName, errMsg, isOptional);

		if (obj[propName]) {
			this.validateString(obj, propName, errMsg + '\'s ', canBeEmpty);
		}
	}

	/**
	 *
	 * @param {object} obj
	 * @param {string} propName
	 * @param {string} errMsg
	 * @param {boolean=} isOptional Defaults to false
	 * @description
	 * Validates a function property.
	 */
	function validateFunctionProperty (obj, propName, errMsg, isOptional) {
		isOptional = !!isOptional;

		/*jshint validthis:true */
		this.validateProperty(obj, propName, errMsg, isOptional);

		if (obj[propName]) {
			this.validateFunction(obj, propName, errMsg + '\'s ');
		}
	}
}());