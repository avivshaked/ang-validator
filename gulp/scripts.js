function scriptsFactory (config) {
	'use strict';

	var gulp = require('gulp');
	var jshint = require('gulp-jshint');
	var concat = require('gulp-concat');
	var rename = require('gulp-rename');
	var uglify = require('gulp-uglify');
	var notify = require('gulp-notify');

	return scripts;

	function scripts () {
		return gulp.src(config.scripts.src)
			.pipe(jshint('.jshintrc'))
			.pipe(jshint.reporter('default'))
			.pipe(concat(config.scripts.destName))
			.pipe(gulp.dest(config.scripts.dest))
			.pipe(rename({ suffix: '.min' }))
			.pipe(uglify())
			.pipe(gulp.dest(config.scripts.dest))
			.pipe(notify({ message: 'Scripts task complete' }));
	}
}

module.exports = scriptsFactory;