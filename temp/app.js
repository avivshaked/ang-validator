angular.module('myApp', ['ang-validator', 'ngMessages'])
	.run([
		'$validatorBuilder',
		function ($validatorBuilder) {
			$validatorBuilder.buildValidator({
				directiveName: 'ngtTest',
				validatorName: 'test',
				validator: function (val, a, b) {
					debugger;
				}
			});
		}
	])
.controller('Ctrl',[
		function () {
			this.regex = /hello/;
		}
	]);

