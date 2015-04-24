var karma = require('gulp-karma');
var gulp = require('gulp');

function testFactory (config, onMinified) {
	onMinified = !!onMinified;

	return test;

	function test () {

		var src = onMinified ?  config.tests.minified.testFiles : config.tests.unminified.testFiles
		return gulp.src(src)
			.pipe(karma({
				configFile: 'karma.conf.js',
				action: 'run'
			}))
			.on('error', function(err) {
				// Make sure failed tests cause gulp to exit non-zero
				throw err;
			});
	}
}

module.exports = testFactory;