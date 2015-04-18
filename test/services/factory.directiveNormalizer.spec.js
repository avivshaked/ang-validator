describe('directiveNormalizer', function () {

	var directiveNormalizer;

	beforeEach(module('ang-validator'));
	beforeEach(inject(function (_directiveNormalizer_) {
		directiveNormalizer = _directiveNormalizer_;
	}));


	describe('convertMethodNameToDirectiveName', function () {

		it('should throw ReferenceError if methodName is not provided', function () {

			var err;
			try {
				directiveNormalizer.convertMethodNameToDirectiveName();
			} catch (e) {
				err = e;
			}
			expect(err instanceof ReferenceError).toBe(true);
		});

		it('should throw TypeError if methodName is not a string', function () {

			var err;
			try {
				directiveNormalizer.convertMethodNameToDirectiveName(1);
			} catch (e) {
				err = e;
			}
			expect(err instanceof TypeError).toBe(true);
		});

		it('should throw RangeError if methodName is an empty string', function () {

			var err;
			try {
				directiveNormalizer.convertMethodNameToDirectiveName('');
			} catch (e) {
				err = e;
			}
			expect(err instanceof RangeError).toBe(true);
		});

		it('should convert a lowercase string with no prefix into the same string', function () {
			var result = directiveNormalizer.convertMethodNameToDirectiveName('test');
			expect(result).toBe('test');
		});

		it('should convert a lowercase string with prefix into prefixString', function () {
			var result = directiveNormalizer.convertMethodNameToDirectiveName('test', 'pre');
			expect(result).toBe('preTest');
		});

		it('should convert a string with a series of uppercase letters into a single uppercase for the series', function () {
			var result = directiveNormalizer.convertMethodNameToDirectiveName('isURL', 'ngv');
			expect(result).toBe('ngvIsUrl');
		});

		it('should convert a string with a series of capital letters followed by regular word and prefiex into a camelCase string', function () {
			var result = directiveNormalizer.convertMethodNameToDirectiveName('testMEImWEIRD', 'ngv');
			expect(result).toBe('ngvTestMeImWeird');
		});

	});

	describe('convertMethodNameToDirectiveName', function () {

		it('should throw ReferenceError if str is not provided', function () {

			var err;
			try {
				directiveNormalizer.fromCamelCase();
			} catch (e) {
				err = e;
			}
			expect(err instanceof ReferenceError).toBe(true);
		});

		it('should throw TypeError if methodName is not a string', function () {

			var err;
			try {
				directiveNormalizer.fromCamelCase(1);
			} catch (e) {
				err = e;
			}
			expect(err instanceof TypeError).toBe(true);
		});

		it('should throw RangeError if methodName is an empty string', function () {

			var err;
			try {
				directiveNormalizer.fromCamelCase('');
			} catch (e) {
				err = e;
			}
			expect(err instanceof RangeError).toBe(true);
		});

		it('should convert a lowercase string with no prefix into the same string', function () {
			var result = directiveNormalizer.fromCamelCase('test');
			expect(result).toBe('test');
		});

		it('should convert a camel case string into a dash delimited lowercase string', function () {
			var result = directiveNormalizer.fromCamelCase('isUrl');
			expect(result).toBe('is-url');
			var result = directiveNormalizer.fromCamelCase('isUrlValid');
			expect(result).toBe('is-url-valid');
		});

	});

});