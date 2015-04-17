describe('internalValidation', function () {

	var internalValidation;

	beforeEach(module('ang-validator'));

	beforeEach(inject(function (_internalValidation_) {
		internalValidation = _internalValidation_;
	}));

	describe('instance', function () {

		it('should be defined', function () {
			expect(internalValidation).toBeDefined();
		});

	});

	describe('validateObject', function () {

		it('should throw ReferenceError if provided with an undefined obj, and not setting isOptional to true', function () {
			var err;
			try {
				internalValidation.validateObject(undefined, 'test');
			} catch (e) {
				err = e;
			}

			expect(err instanceof ReferenceError).toBe(true);
			expect(err.message).toBe('test must be provided.')
		});

		it('should not throw if provided with an undefined object and isOptional set to true', function () {
			var err;
			try {
				internalValidation.validateObject(undefined, 'test', true);
			} catch (e) {
				err = e;
			}

			expect(err).not.toBeDefined();
		});

		it('should not throw if provided with a defined object', function () {
			var err;
			try {
				internalValidation.validateObject({}, 'test');
			} catch (e) {
				err = e;
			}

			expect(err).not.toBeDefined();
		});

	});

	describe('validateProperty', function () {

		it('should throw ReferenceError if provided with an object that does not hold a property named in propName.', function () {
			var err;
			try {
				internalValidation.validateProperty({}, 'test', 'test');
			} catch (e) {
				err = e;
			}

			expect(err instanceof ReferenceError).toBe(true);
			expect(err.message).toBe('test must have a test property.')
		});

		it('should not throw ReferenceError if provided with an object that does not hold a property named in propName, and isOptional set to true', function () {
			var err;
			try {
				internalValidation.validateProperty({}, 'test', 'test', true);
			} catch (e) {
				err = e;
			}

			expect(err).not.toBeDefined();
		});

		it('should not throw if provided with a defined object that has the property named in propName', function () {
			var err;
			try {
				internalValidation.validateProperty({test: 'test'}, 'test', 'test', true);
			} catch (e) {
				err = e;
			}

			expect(err).not.toBeDefined();
		});

	});


	describe('validateString', function () {

		it('should throw TypeError when provided with a property that is not a string.', function () {

			var err;
			try {
				internalValidation.validateString({test: function(){}}, 'test', 'test ');
			} catch (e) {
				err = e;
			}

			expect(err instanceof TypeError).toBe(true);
			expect(err.message).toBe('test test property must be a string.')
		});

		it('should throw RangeError when provided with a property that is an empty string and canBeEmpty is not set to true.', function () {

			var err;
			try {
				internalValidation.validateString({test: ''}, 'test', 'test ');
			} catch (e) {
				err = e;
			}

			expect(err instanceof RangeError).toBe(true);
			expect(err.message).toBe('test test property must not be an empty string.')
		});

		it('should not throw RangeError when provided with a property that is an empty string and canBeEmpty is set to true.', function () {

			var err;
			try {
				internalValidation.validateString({test: ''}, 'test', 'test ', true);
			} catch (e) {
				err = e;
			}

			expect(err).not.toBeDefined();
		});

		it('should not throw when provided with a property that is a valid string.', function () {

			var err;
			try {
				internalValidation.validateString({test: 'valid'}, 'test', 'test ');
			} catch (e) {
				err = e;
			}

			expect(err).not.toBeDefined();
		});

	});

	describe('validateFunction', function () {

		it('should throw TypeError when provided with a property that is not a function.', function () {

			var err;
			try {
				internalValidation.validateFunction({test: ''}, 'test', 'test ');
			} catch (e) {
				err = e;
			}

			expect(err instanceof TypeError).toBe(true);
			expect(err.message).toBe('test test property must be a function.')
		});

		it('should not throw TypeError when provided with a property that is a function.', function () {

			var err;
			try {
				internalValidation.validateFunction({test: function () {}}, 'test', 'test ');
			} catch (e) {
				err = e;
			}

			expect(err).not.toBeDefined();
		});


	});

	describe('validateStringProperty', function () {

		beforeEach(function () {
			spyOn(internalValidation, 'validateProperty');
			spyOn(internalValidation, 'validateString');
		});

		it('should invoke validateProperty with obj, propName, errMsg, isOptional', function () {
			var obj = {};
			internalValidation.validateStringProperty(obj, 'test', 'test2', true);

			expect(internalValidation.validateProperty).toHaveBeenCalledWith(obj, 'test', 'test2', true);

		});

		it('should convert isOptional to false if not provided', function () {
			var obj = {};
			internalValidation.validateStringProperty(obj, 'test', 'test2');

			expect(internalValidation.validateProperty).toHaveBeenCalledWith(obj, 'test', 'test2', false);
		});

		it('should invoke validateString if the object has a property named by propName with obj, propName, errMsg, canBeEmpty', function () {
			var obj = {test: 'test'};
			internalValidation.validateStringProperty(obj, 'test', 'test2', false, true);

			expect(internalValidation.validateString).toHaveBeenCalledWith(obj, 'test', 'test2\'s ', true);
		});

		it('should not invoke validateString if the object has no property named by propName', function () {
			var obj = {};
			internalValidation.validateStringProperty(obj, 'test', 'test2', false, true);

			expect(internalValidation.validateString).not.toHaveBeenCalled();
		});

		it('should invoke convert canBeEmpty to false if not provided', function () {
			var obj = {test: 'test'};
			internalValidation.validateStringProperty(obj, 'test', 'test2', false);

			expect(internalValidation.validateString).toHaveBeenCalledWith(obj, 'test', 'test2\'s ', false);
		});

	});

	describe('validateFunctionProperty', function () {

		beforeEach(function () {
			spyOn(internalValidation, 'validateProperty');
			spyOn(internalValidation, 'validateFunction');
		});

		it('should invoke validateProperty with obj, propName, errMsg, isOptional', function () {
			var obj = {};
			internalValidation.validateFunctionProperty(obj, 'test', 'test2', true);

			expect(internalValidation.validateProperty).toHaveBeenCalledWith(obj, 'test', 'test2', true);

		});

		it('should convert isOptional to false if not provided', function () {
			var obj = {};
			internalValidation.validateFunctionProperty(obj, 'test', 'test2');

			expect(internalValidation.validateProperty).toHaveBeenCalledWith(obj, 'test', 'test2', false);
		});

		it('should invoke validateFunction if the object has a property named by propName with obj, propName, errMsg', function () {
			var obj = {test: 'test'};
			internalValidation.validateFunctionProperty(obj, 'test', 'test2');

			expect(internalValidation.validateFunction).toHaveBeenCalledWith(obj, 'test', 'test2\'s ');
		});

		it('should not invoke validateString if the object has no property named by propName', function () {
			var obj = {};
			internalValidation.validateFunctionProperty(obj, 'test', 'test2', false, true);

			expect(internalValidation.validateFunction).not.toHaveBeenCalled();
		});


	});


});