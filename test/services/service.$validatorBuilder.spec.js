describe('$validatorBuilder', function () {

	var $validatorBuilder;



	beforeEach(module('ang-validator'));

	beforeEach(function () {
		angular.module('ang-validator');
	});

	beforeEach(inject(function (_$validatorBuilder_) {
		$validatorBuilder = _$validatorBuilder_;
	}));

	describe('instance', function () {

		it('should be defined', function () {
			expect($validatorBuilder).toBeDefined();
		});

	});

	describe('_validateBuildConfig', function () {

		var errMsg;
		var oConfig;

		beforeEach(function () {
			spyOn($validatorBuilder.internalValidation, 'validateObject');
			spyOn($validatorBuilder.internalValidation, 'validateStringProperty');
			spyOn($validatorBuilder.internalValidation, 'validateFunctionProperty');

			errMsg = 'ang-validator: $validatorBuilder: _validateBuildConfig: oConfig';
			oConfig = {};
			$validatorBuilder._validateBuildConfig(oConfig);
		});


		it('should invoke $validatorBuilder.internalValidation.validateObject with oConfig and errMsg', function () {
			expect($validatorBuilder.internalValidation.validateObject).toHaveBeenCalledWith(oConfig, errMsg);
		});

		it('should invoke $validatorBuilder.internalValidation.validateStringProperty with oConfig, "directiveName" and errMsg', function () {
			expect($validatorBuilder.internalValidation.validateStringProperty).toHaveBeenCalledWith(oConfig, 'directiveName', errMsg);
		});

		it('should invoke $validatorBuilder.internalValidation.validateStringProperty with oConfig, "validatorName" and errMsg', function () {
			expect($validatorBuilder.internalValidation.validateStringProperty).toHaveBeenCalledWith(oConfig, 'validatorName', errMsg);
		});

		it('should invoke $validatorBuilder.internalValidation.validateFunctionProperty with oConfig, "validator" and errMsg', function () {
			expect($validatorBuilder.internalValidation.validateFunctionProperty).toHaveBeenCalledWith(oConfig, 'validator', errMsg);
		});
	});

	describe('_validatorDirective', function () {

		var oConfig;
		var directiveObject;
		var linkFunc;

		beforeEach(function () {
			oConfig = {};
			linkFunc = function (oConfig, otherStuff) {
				return {
					self: this,
					oConfig: oConfig,
					otherStuff: otherStuff
				}
			};
			$validatorBuilder._validatorLink = linkFunc;

		});
		
		it('should return an object {restrict: "A", require : "ngModel", link : self._validatorLink}', function () {
			directiveObject = $validatorBuilder._validatorDirective(oConfig);
			expect(directiveObject.restrict).toBe('A');
			expect(directiveObject.require).toBe('ngModel');
		});
		
		it('should bind oConfig and self to link function ', function () {
			directiveObject = $validatorBuilder._validatorDirective(oConfig);
			var linkResult = directiveObject.link('some other stuff');
			expect(linkResult.self).toBe($validatorBuilder);
			expect(linkResult.oConfig).toBe(oConfig);
			expect(linkResult.otherStuff).toBe('some other stuff');
		});

	});

	describe('buildValidator', function () {

		var oConfig;

		beforeEach(function () {
			spyOn($validatorBuilder, '_validateBuildConfig');
			spyOn($validatorBuilder, '_validatorDirective');
			oConfig = {
				directiveName: 'test',
				validatorName: 'test',
				validator: jasmine.createSpy('validator')
			};
		});

		it('should invoke _validateBuildConfig with oConfig', function () {
			$validatorBuilder.buildValidator(oConfig);
			expect($validatorBuilder._validateBuildConfig).toHaveBeenCalledWith(oConfig);
		});
	});


});