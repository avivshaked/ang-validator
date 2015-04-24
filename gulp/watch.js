function watchFactory (config) {
	'use strict';

	var gulp = require('gulp');

	return watch;

	function watch () {

		// Watch .js files
		gulp.watch(config.scripts.src, ['scripts', 'test', 'test-minified'])
			.on('error', swallowError);
		gulp.watch(config.tests.specsSrc, ['test', 'test-minified'])
			.on('error', swallowError);

		function swallowError (err) {
			console.error(err);
		}

	}

}

module.exports = watchFactory;