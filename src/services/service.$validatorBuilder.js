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
				buildValidator      : buildValidator
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
				 * It first verifies that val exists, or that the
				 */
				function validatorFunc (val) {
					if (element[0].required || val) {
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
		};
	}


}());