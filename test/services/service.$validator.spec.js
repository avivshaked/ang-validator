describe('$validator', function () {

	var $injector;
	var validator;
	var $validator;

	beforeEach(module('ang-validator'));
	beforeEach(inject(function (_$injector_) {
		$injector = _$injector_;
	}));

	describe('validations', function () {

		beforeEach(function () {
			validator = window.validator;
			window.validator = undefined;
		});

		afterEach(function () {
			window.validator = validator;
		});


		it('should throw Reference error when trying to instantiate', function () {
			var err;
			try {
				$injector.get('$validator');
			} catch (e) {
				err = e;
			}
			expect(err instanceof ReferenceError).toBe(true);
			expect(!!~err.message.indexOf('No instance of validator object found')).toBe(true);
		});

		it('should throw Type error when trying to instantiate and validator object is not the right object', function () {
			var err;
			window.validator = {};
			try {
				$injector.get('$validator');
			} catch (e) {
				err = e;
			}
			expect(err instanceof TypeError).toBe(true);
			expect(!!~err.message.indexOf('instance found is not chriso\'s validator.js object')).toBe(true);
		});

		it('should throw Range error when trying to instantiate and validator version is not 3, or the subversion is not 38 and up', function () {
			var err;
			window.validator = {
				version   : '3.34.0',
				extend    : function () {
				},
				isHexColor: function () {
				}
			};
			try {
				$injector.get('$validator');
			} catch (e) {
				err = e;
			}
			expect(err instanceof RangeError).toBe(true);
			expect(!!~err.message.indexOf('Required 3, sub version 38 and up.')).toBe(true);
		});


	});

	describe('service', function () {
		beforeEach(function () {
			$validator = $injector.get('$validator');
		});

		it('should have all the following methods', function () {
			var methodNames = ['equals', 'contains', 'matches', 'isEmail', 'isURL', 'isFQDN', 'isIP',
				'isAlpha', 'isNumeric', 'isAlphanumeric', 'isBase64', 'isHexadecimal', 'isHexColor', 'isLowercase',
				'isUppercase', 'isInt', 'isFloat', 'isDivisibleBy', 'isNull', 'isLength', 'isByteLength', 'isUUID',
				'isDate', 'isAfter', 'isBefore', 'isIn', 'isCreditCard', 'isISIN', 'isISBN', 'isMobilePhone', 'isJSON',
				'isMultibyte', 'isAscii', 'isFullWidth', 'isHalfWidth', 'isVariableWidth', 'isSurrogatePair', 'isMongoId',
				'isCurrency', 'toString', 'toDate', 'toFloat', 'toInt', 'toBoolean', 'trim', 'ltrim', 'rtrim', 'escape',
				'stripLow', 'whitelist', 'blacklist', 'normalizeEmail', 'extend'];


			methodNames.forEach(function (methodName) {
				expect($validator[methodName]).toBeDefined();
				expect($validator[methodName] instanceof Function).toBe(true);
			});
		});
	})

});