var gulp = require('gulp');
var config = require('./gulp/config.json');

gulp.task('test', require('./gulp/test')(config));
gulp.task('test-minified', require('./gulp/test')(config, true));
gulp.task('scripts', require('./gulp/scripts')(config));
gulp.task('watch', require('./gulp/watch')(config));
gulp.task('build', ['scripts', 'test', 'test-minified']);
gulp.task('default', ['build', 'watch']);
