describe('validatorDirectives', function () {

	var methodNames = [];
	var htmlDirectiveNames;
	var directiveNames;
	var directiveNormalizer;
	var validatorNames;
	var validClasses;
	var $rootScope;
	var $compile;

	beforeEach(module('ang-validator'));
	beforeEach(inject(function (_directiveNormalizer_, _$rootScope_, _$compile_) {
		directiveNormalizer = _directiveNormalizer_;
		$rootScope = _$rootScope_;
		$compile = _$compile_;
	}));

	beforeEach(function () {
		methodNames = ['equals', 'contains', 'matches', 'isEmail', 'isURL', 'isFQDN', 'isIP',
			'isAlpha', 'isNumeric', 'isAlphanumeric', 'isBase64', 'isHexadecimal', 'isHexColor', 'isLowercase',
			'isUppercase', 'isInt', 'isFloat', 'isDivisibleBy', 'isNull', 'isLength', 'isByteLength', 'isUUID',
			'isDate', 'isAfter', 'isBefore', 'isIn', 'isCreditCard', 'isISIN', 'isISBN', 'isMobilePhone', 'isJSON',
			'isMultibyte', 'isAscii', 'isFullWidth', 'isHalfWidth', 'isVariableWidth', 'isSurrogatePair', 'isMongoId',
			'isCurrency'];

		directiveNames = methodNames.map(function (methodName) {
			return directiveNormalizer.convertMethodNameToDirectiveName(methodName, 'ngv');
		});

		htmlDirectiveNames = directiveNames.map(function (directiveName) {
			return directiveNormalizer.fromCamelCase(directiveName);
		});

		validatorNames = methodNames.map(function (methodName) {
			return directiveNormalizer.convertMethodNameToDirectiveName(methodName);
		});

		validClasses = validatorNames.map(function (validatorName) {
			return 'ng-valid-' + directiveNormalizer.fromCamelCase(validatorName);
		});
	});

	describe('verify $validator directives', function () {

		var element;
		var scope;
		it('should have a valid classes', function () {
			methodNames.forEach(function (methodName, index) {
				element = angular.element('<input ng-model="model" ' + htmlDirectiveNames[index] + '>');
				scope = $rootScope.$new();
				element = $compile(element)(scope);
				scope.$digest();
				expect(element.hasClass(validClasses[index])).toBe(true);
			});
		});

	});


});