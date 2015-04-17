function watchFactory (config) {
	'use strict';

	var gulp = require('gulp');

	return watch;

	function watch () {

		// Watch .js files
		gulp.watch(config.scripts.src, ['scripts']);

	}

}

module.exports = watchFactory;