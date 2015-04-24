var karma = require('gulp-karma');
var gulp = require('gulp');

function testFactory (config) {
	return test;

	function test () {

		return gulp.src(config.tests.testFiles)
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