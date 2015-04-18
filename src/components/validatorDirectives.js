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