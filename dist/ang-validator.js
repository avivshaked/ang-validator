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
			'directiveNormalizer',
			function ($validator, $validatorBuilder, directiveNormalizer) {

				function buildValidatorsArray () {
					var methodNames = ['equals', 'contains', 'matches', 'isEmail', 'isURL', 'isFQDN', 'isIP',
						'isAlpha', 'isNumeric', 'isAlphanumeric', 'isBase64', 'isHexadecimal', 'isHexColor', 'isLowercase',
						'isUppercase', 'isInt', 'isFloat', 'isDivisibleBy', 'isNull', 'isLength', 'isByteLength', 'isUUID',
						'isDate', 'isAfter', 'isBefore', 'isCreditCard', 'isISIN', 'isISBN', 'isMobilePhone', 'isJSON',
						'isMultibyte', 'isAscii', 'isFullWidth', 'isHalfWidth', 'isVariableWidth', 'isSurrogatePair', 'isMongoId',
						'isCurrency'];
					return methodNames.map(function (methodName) {
						return {
							directiveName: directiveNormalizer.convertMethodNameToDirectiveName(methodName, 'ngv'),
							validatorName: directiveNormalizer.convertMethodNameToDirectiveName(methodName),
							validator: $validator[methodName]
						};
					});
				}

				function buildSanitizersArray () {
					var methodNames = ['toString', 'toDate', 'toFloat', 'toInt', 'toBoolean', 'trim', 'ltrim', 'rtrim',
					'escape', 'stripLow', 'whitelist', 'blacklist', 'normalizeEmail'];
					return methodNames.map(function (methodName) {
						return {
							directiveName: directiveNormalizer.convertMethodNameToDirectiveName(methodName, 'ngs'),
							sanitizer: $validator[methodName]
						};
					});
				}

				$validatorBuilder.buildValidators(buildValidatorsArray());

				// isIn is a special case because it needs to get an array as a single argument
				$validatorBuilder.buildValidator({
					directiveName: 'ngvIsIn',
					validatorName: 'isIn',
					validator: function () {
						var args = Array.prototype.slice.call(arguments);
						var val = args.shift();
						return $validator.isIn(val, args);
					}
				});

				$validatorBuilder.buildSanitizers(buildSanitizersArray());
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

	var _ErrHead  = 'ang-validator: directiveNormalizer: ';

	angular.module('ang-validator')
		.factory('directiveNormalizer', [
			DirectiveNormalizer
		]);
	function DirectiveNormalizer () {
		return {
			convertMethodNameToDirectiveName: convertMethodNameToDirectiveName,
			fromCamelCase: fromCamelCase
		};

		/**
		 *
		 * @param {string} methodName
		 * @param {string=} prefix
		 * @returns {string}
		 */
		function convertMethodNameToDirectiveName (methodName, prefix) {
			var _errMsg = _ErrHead + 'convertMethodNameToDirectiveName: ';

			// Validations and defaults
			if(!angular.isString(prefix)) {
				prefix = '';
			}

			if (angular.isUndefined(methodName)) {
				throw new ReferenceError(_errMsg + 'methodName argument must be provided');
			}
			if (!angular.isString(methodName)) {
				throw new TypeError(_errMsg + 'methodName argument must be a string');
			}
			if (methodName === '') {
				throw new RangeError(_errMsg + 'methodName argument must not be an empty string');
			}


			// Declarations
			var i;
			var originalChars = methodName.split('');
			var processedChars = [];
			var lastIsUppercase =true;

			// Set first char. IF prefix exists then first char is uppercase, otherwise its lowercase.
			if (prefix) {
				processedChars[0] = originalChars[0].toUpperCase();
			} else {
				processedChars[0] = originalChars[0].toLowerCase();
			}

			// Iterate through remaining chars. Each uppercase is converted to lowercase if the char before was an uppercase.
			// The reason for this is - you dont want angular to normalize isURL method to is-u-r-l bu to isUrl or with prefix
			// ngvIsUrl
			for (i=1; i<originalChars.length; i+=1) {
				if (/[a-zA-Z]/.test(originalChars[i]) && originalChars[i] === originalChars[i].toUpperCase()) {
					if (lastIsUppercase) {
						// This checks if there are any more chars. If there are we need to verify that the next one is not
						// a lowercase char. If it is, this chat must remain capitalized.
						// example: isURLValid should be converted to isUrlValid and not isUrlvalid
						if (i+1 < originalChars.length && /[a-zA-Z]/.test(originalChars[i+1]) && originalChars[i+1] === originalChars[i+1].toLowerCase()) {
							processedChars.push(originalChars[i]);
						} else {
							processedChars.push(originalChars[i].toLowerCase());
						}
					} else {
						processedChars.push(originalChars[i]);
						lastIsUppercase = true;
					}
				} else {
					processedChars.push(originalChars[i]);
					lastIsUppercase = false;
				}
			}

			return prefix + processedChars.join('');
		}

		function fromCamelCase (str) {

			// VALIDATIONS
			var _errMsg = _ErrHead + 'fromCamelCase: ';

			if (angular.isUndefined(str)) {
				throw new ReferenceError(_errMsg + 'str argument must be provided');
			}
			if (!angular.isString(str)) {
				throw new TypeError(_errMsg + 'str argument must be a string');
			}
			if (str === '') {
				throw new RangeError(_errMsg + 'str argument must not be an empty string');
			}

			var i;
			var originalChars = str.split('');
			var processedChars = [];

			processedChars[0] = originalChars[0].toLowerCase();
			for (i=1; i<originalChars.length; i+=1) {
				if (/[a-zA-Z]/.test(originalChars[i]) && originalChars[i] === originalChars[i].toUpperCase()) {
					processedChars.push('-');
					processedChars.push(originalChars[i].toLowerCase());
				} else {
					processedChars.push(originalChars[i]);
				}
			}

			return processedChars.join('');
		}
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
				buildValidators: buildValidators,
				/**
				 *
				 * @param {{directiveName: string, validator: function}} oConfig
				 * @description
				 * Builds a new parser directive
				 */
				buildSanitizer: buildSanitizer,
				/**
				 *
				 * @param {Array<{directiveName: string, validator: function}>} arrConfig
				 * @description
				 * Builds multiple new parser directives
				 */
				buildSanitizers: buildSanitizers
			};

			return new ValidatorBuilder();


			/**
			 *
			 * @param {{directiveName: string, validatorName: string, validator: function}} oConfig
			 * @param {boolean=} isSanitizer Defaults to false
			 * @private
			 */
			function _validateBuildConfig (oConfig, isSanitizer) {

				var _errMsg = _errHead + '_validateBuildConfig: oConfig';

				isSanitizer = !!isSanitizer;

				this.internalValidation.validateObject(oConfig, _errMsg);
				this.internalValidation.validateStringProperty(oConfig, 'directiveName', _errMsg);
				this.internalValidation.validateFunctionProperty(oConfig, 'validator', _errMsg);


				if (!isSanitizer) {
					this.internalValidation.validateStringProperty(oConfig, 'validatorName', _errMsg);
				}
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
			 * @param {{directiveType: string, directiveName: string, validatorName: string, validator: function}} oConfig
			 * @param {object} scope
			 * @param {angular.element} element
			 * @param {object} attr
			 * @param {object} model
			 * @private
			 */
			function _validatorLink (oConfig, scope, element, attr, model) {

				// Add validator/Sanitizer
				if (oConfig.directiveType === 'validator') {
					model.$validators[oConfig.validatorName] = validatorFunc;
				} else if (oConfig.directiveType === 'sanitizer') {
					model.$parsers.push(validatorFunc);
				}

				/**
				 *
				 * @param {*} val
				 * @returns {*}
				 * @description
				 * The validator function of the validator directive.
				 * It first verifies that val exists, or that one of the attributes is ngvRequired
				 */
				function validatorFunc (val) {
					if (val || (attr.ngvRequired && oConfig.directiveType === 'validator')) {
						var arg = scope.$eval(attr[oConfig.directiveName]);
						if (angular.isArray(arg)) {
							var args = [];
							args.push(val);
							args = args.concat(arg);
							return oConfig.validator.apply(this, args);
						}
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

				oConfig.directiveType = 'validator';

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

			/**
			 *
			 * @param {{directiveName: string, sanitizer: function}} oConfig
			 * @description
			 * Builds a new parser directive
			 */
			function buildSanitizer (oConfig) {
				var self = this;

				oConfig.validator = oConfig.sanitizer;
				// Validate oConfig
				self._validateBuildConfig(oConfig, true);

				oConfig.directiveType = 'sanitizer';

				// Declare a new directive
				self.$compileProvider.directive(oConfig.directiveName, self._validatorDirective.bind(self, oConfig));
			}

			/**
			 *
			 * @param {Array<{directiveName: string, validator: function}>} arrConfig
			 * @description
			 * Builds multiple new parser directives
			 */
			function buildSanitizers (arrConfig) {
				var self = this;
				var _errMsg = _errHead + 'buildSanitizers: arrConfig';
				// Validate arr config
				self.internalValidation.validateObject(arrConfig, _errMsg);
				if (!angular.isArray(arrConfig)) {
					throw new TypeError(_errMsg + ' should be an array');
				}

				arrConfig.forEach(function (oConfig) {
					self.buildSanitizer(oConfig);
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