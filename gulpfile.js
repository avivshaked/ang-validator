var gulp = require('gulp');
var config = require('./gulp/config.json');

gulp.task('test', require('./gulp/test')(config));
gulp.task('scripts', require('./gulp/scripts')(config));
gulp.task('watch', require('./gulp/watch')(config));
gulp.task('default', function() {
	// place code for your default task here
});