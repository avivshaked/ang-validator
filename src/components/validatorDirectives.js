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
				$validatorBuilder.buildValidators(buildValidatorsArray());

				// isIn is a special case because it needs to get an array as a single argument
				$validatorBuilder.buildValidator({
					directiveName: 'ngvIsIn',
					validatorName: 'isIn',
					validator: function () {
						debugger;
						var args = Array.prototype.slice.call(arguments);
						var val = args.shift();
						return $validator.isIn(val, args);
					}
				});
			}
		]);
}());