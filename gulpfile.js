var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence').use(gulp);


// Browser reloading tasks

gulp.task('sass', function(){
    return gulp.src('app/site.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
    }))
});


gulp.task('browser-sync', function(){
    browserSync.init({
        server:{
            baseDir: 'app'
        },
    });
});

// This is the master control task for browser reloading

gulp.task('watch', ['browser-sync', 'sass'], function(){
    gulp.watch('app/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/**/*.js', browserSync.reload);
});

// In keeping with best practices, the watch task is usually
// Set to 'default' using the runsequence plugin.
// For reference, tasks named 'default' can be called by
// Simply typing $ gulp in the CLI


gulp.task('default', ['watch']);



gulp.task('bootstrap', function() {
    gulp.src('./node_modules/bootstrap/scss/**/*.scss')
        .pipe(gulp.dest('./app/scss/bootstrap'));

    gulp.src('./node_modules/bootstrap/js/dist/**/*.js')
        .pipe(gulp.dest('./app/js/bootstrap'));

});

// The following tasks will create the production files
// and send them to the dist folder.

gulp.task('useref', function(){
    return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
        interlaced: true
      })))
    .pipe(gulp.dest('dist/images'));
  });

gulp.task('fonts', function(){
    return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));
});

// This clean task will clear out the dist folder of 
// Unwanted or obsolete files previously compiled

gulp.task('clean:dist', function(){
    return del.sync('dist');
});

gulp.task('build', function(callback){
    runSequence('clean:dist',
        ['sass', 'useref', 'images', 'fonts'],
        callback
    );
});
