describe('$validatorBuilder', function () {

	var $validatorBuilder;
	var $rootScope;
	var $compile;



	beforeEach(module('ang-validator'));

	beforeEach(function () {
		angular.module('ang-validator');
	});

	beforeEach(inject(function (_$validatorBuilder_, _$rootScope_, _$compile_) {
		$validatorBuilder = _$validatorBuilder_;
		$rootScope = _$rootScope_;
		$compile = _$compile_;
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

		});


		describe('not provided with isSanitizer', function () {

			beforeEach(function () {

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


		describe('provided with isSanitizer set to true', function () {

			beforeEach(function () {

				errMsg = 'ang-validator: $validatorBuilder: _validateBuildConfig: oConfig';
				oConfig = {};
				$validatorBuilder._validateBuildConfig(oConfig, true);
			});

			it('should invoke $validatorBuilder.internalValidation.validateObject with oConfig and errMsg', function () {
				expect($validatorBuilder.internalValidation.validateObject).toHaveBeenCalledWith(oConfig, errMsg);
			});

			it('should invoke $validatorBuilder.internalValidation.validateStringProperty with oConfig, "directiveName" and errMsg', function () {
				expect($validatorBuilder.internalValidation.validateStringProperty).toHaveBeenCalledWith(oConfig, 'directiveName', errMsg);
			});

			it('should not invoke $validatorBuilder.internalValidation.validateStringProperty', function () {
				expect($validatorBuilder.internalValidation.validateStringProperty.calls.count()).toBe(1);
			});

			it('should invoke $validatorBuilder.internalValidation.validateFunctionProperty with oConfig, "sanitizer" and errMsg', function () {
				expect($validatorBuilder.internalValidation.validateFunctionProperty).toHaveBeenCalledWith(oConfig, 'sanitizer', errMsg);
			});

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
			spyOn($validatorBuilder.$compileProvider, 'directive');
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

		it('should invoke $compileProvider.directive', function () {
			$validatorBuilder.buildValidator(oConfig);
			expect($validatorBuilder.$compileProvider.directive).toHaveBeenCalled();
			expect($validatorBuilder.$compileProvider.directive.calls.allArgs()[0][0]).toBe('test');
		});
	});

	describe('creating a directive', function () {

		var oConfig;
		var element;
		var scope;

		beforeEach(function () {
			oConfig = {
				directiveName: 'ngvTest',
				validatorName: 'test',
				validator: function (val, conf) {
					return val === conf;
				}
			};
			$validatorBuilder.buildValidator(oConfig);



		});

		it('should throw if ng-model is not provided', function () {
			var testFunc = function () {
				element = angular.element('<input ngv-test>');
				scope = $rootScope.$new();
				element = $compile(element)(scope);
				scope.$digest();
			};
			expect(testFunc).toThrow();
		});

		it('should add class ng-valid-test to element', function () {
			element = angular.element('<input ng-model="model" ngv-test>');
			scope = $rootScope.$new();
			element = $compile(element)(scope);
			scope.$digest();
			expect(element.hasClass('ng-valid-test')).toBe(true);
		});

		it('should invoke validator function with the value set to the model and config value', function () {
			spyOn(oConfig, 'validator');
			element = angular.element('<input ng-model="model" ngv-test="testObj">');
			scope = $rootScope.$new();
			scope.testObj = {
				test: 'object'
			};
			element = $compile(element)(scope);
			scope.$digest();
			element.controller('ngModel').$setViewValue('test');
			expect(oConfig.validator).toHaveBeenCalledWith('test', scope.testObj);
		});

		it('should have ng-invalid-test when given a value different from conf', function () {
			element = angular.element('<input ng-model="model" ngv-test="\'test\'">');
			scope = $rootScope.$new();
			element = $compile(element)(scope);
			scope.$digest();
			element.controller('ngModel').$setViewValue('not test');
			expect(element.hasClass('ng-invalid-test')).toBe(true);
		});

		it('should have ng-valid-test when given a value that equals conf', function () {
			element = angular.element('<input ng-model="model" ngv-test="\'test\'">');
			scope = $rootScope.$new();
			element = $compile(element)(scope);
			scope.$digest();
			element.controller('ngModel').$setViewValue('test');
			expect(element.hasClass('ng-valid-test')).toBe(true);
		});

		it('should have ng-invalid-test before being given a value if ngv-required attribute is present', function () {
			element = angular.element('<input ng-model="model" ngv-test="\'test\'" ngv-required="true">');
			scope = $rootScope.$new();
			element = $compile(element)(scope);
			scope.$digest();
			expect(element.hasClass('ng-invalid-test')).toBe(true);
		})


	});

	describe('buildDirectives', function () {

		var oConfig1, oConfig2, oConfig3;
		var arrConfig;

		beforeEach(function () {
			oConfig1 = {};
			oConfig2 = {};
			oConfig3 = {};
			arrConfig = [oConfig1, oConfig2, oConfig3];

			spyOn($validatorBuilder, 'buildValidator');
			spyOn($validatorBuilder.internalValidation, 'validateObject');

		});

		it('should invoke $validatorBuilder.internalValidation.validateObject', function () {
			spyOn(angular, 'isArray').and.returnValue(true);

			$validatorBuilder.buildValidators(arrConfig);
			expect($validatorBuilder.internalValidation.validateObject).toHaveBeenCalled();
		});

		it('should invoke angular.isArray with arrConfig ', function () {
			spyOn(angular, 'isArray').and.returnValue(true);

			$validatorBuilder.buildValidators(arrConfig);
			expect(angular.isArray).toHaveBeenCalledWith(arrConfig);
		});

		it('should throw Type error if angular.isArray returns false', function () {
			spyOn(angular, 'isArray').and.returnValue(false);

			var err;
			try {
				$validatorBuilder.buildValidators(arrConfig);
			} catch (e) {
				err = e;
			}
			expect(err instanceof TypeError).toBe(true);
		});

		it('should invoke $validatorBuilder 3 times, and with oConfig1, oConfig2, oConfig3 respectivly', function () {
			spyOn(angular, 'isArray').and.returnValue(true);

			$validatorBuilder.buildValidators(arrConfig);
			expect($validatorBuilder.buildValidator.calls.count()).toBe(3);
			expect($validatorBuilder.buildValidator.calls.allArgs()[0][0]).toBe(oConfig1);
			expect($validatorBuilder.buildValidator.calls.allArgs()[1][0]).toBe(oConfig2);
			expect($validatorBuilder.buildValidator.calls.allArgs()[2][0]).toBe(oConfig3);

		});

	});


});