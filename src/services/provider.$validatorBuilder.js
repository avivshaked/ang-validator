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
			 * @param {boolean=} isSanitizer Defaults to false
			 * @private
			 */
			function _validateBuildConfig (oConfig, isSanitizer) {

				var _errMsg = _errHead + '_validateBuildConfig: oConfig';

				isSanitizer = !!isSanitizer;

				this.internalValidation.validateObject(oConfig, _errMsg);
				this.internalValidation.validateStringProperty(oConfig, 'directiveName', _errMsg);

				if (!isSanitizer) {
					this.internalValidation.validateStringProperty(oConfig, 'validatorName', _errMsg);
					this.internalValidation.validateFunctionProperty(oConfig, 'validator', _errMsg);
				} else {
					this.internalValidation.validateFunctionProperty(oConfig, 'sanitizer', _errMsg);
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