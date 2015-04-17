angular.module('myApp', ['ang-validator'])
	.run([
		'$validatorBuilder',
		function ($validatorBuilder) {
			$validatorBuilder.buildValidator({
				validatorName: 'ngvTest',
				directiveName: 'ngvTest',
				validator    : function (val, conf) {
					return val === 'test';
				}
			});


		}
	]);
