import gulp from 'gulp';
import babel from 'gulp-babel';
import print from 'gulp-print';
import nodemon from 'gulp-nodemon';
import path from 'path';


// build sources
gulp.task('build', () => {
  return gulp.src('src/**/*.js')          // #1. select all js files in the src folder
        .pipe(print())                    // #2. print each file in the stream
      .pipe(babel())                      // #3. transpile ES2015 to ES5 using ES2015 preset
      .pipe(gulp.dest('dist'));           // #4. copy the results to the build folder
});

gulp.task('start', ['build'], () =>
  nodemon({
    script: path.join('dist', 'server.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['build']
}));
