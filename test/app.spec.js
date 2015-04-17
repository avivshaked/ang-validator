describe('ang-validator', function() {

	beforeEach(module('ang-validator'));

	it('should be defined', function () {
		var angValidator = angular.module('ang-validator');
		expect(angValidator).toBeDefined();
	});
});