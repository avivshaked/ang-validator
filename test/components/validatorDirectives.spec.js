describe('validatorDirectives', function () {

	var methodNames = [];
	var htmlDirectiveNames;
	var directiveNames;
	var directiveNormalizer;
	var validatorNames;
	var validClasses;
	var validatorFunctions;
	var $rootScope;
	var $compile;
	var $validator;

	beforeEach(module('ang-validator'));
	beforeEach(inject(function (_directiveNormalizer_, _$rootScope_, _$compile_, $injector) {
		directiveNormalizer = _directiveNormalizer_;
		$rootScope = _$rootScope_;
		$compile = _$compile_;
		$validator = $injector.get('$validator');
	}));


	describe('verify $validator directives', function () {

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

	describe('verify sanitizers directives', function () {

		beforeEach(function () {
			methodNames = ['toString', 'toDate', 'toFloat', 'toInt', 'toBoolean', 'trim', 'ltrim', 'rtrim',
				'escape', 'stripLow', 'whitelist', 'blacklist', 'normalizeEmail'];

			directiveNames = methodNames.map(function (methodName) {
				return directiveNormalizer.convertMethodNameToDirectiveName(methodName, 'ngs');
			});

			htmlDirectiveNames = directiveNames.map(function (directiveName) {
				return directiveNormalizer.fromCamelCase(directiveName);
			});

			validatorFunctions = methodNames.map(function (methodName) {
				return $validator[methodName];
			})
		});

		var element;
		var scope;
		var model;
		it('should have a model that has a parser array with one parser', function () {
			methodNames.forEach(function (methodName, index) {
				element = angular.element('<input ng-model="model" ' + htmlDirectiveNames[index] + '>');
				scope = $rootScope.$new();
				element = $compile(element)(scope);
				scope.$digest();
				model = element.controller('ngModel');
				expect(model.$parsers.length).toBe(1);
			});
		});

	});


});