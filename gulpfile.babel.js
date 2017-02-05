'use strict';

import gulp from 'gulp';
import nunjucks from 'gulp-nunjucks';
import concat from 'gulp-concat';
import child_process from 'child_process';

const outdir = "assets/";

gulp.task("css", () => {
    gulp.src('node_modules/todomvc-app-css/index.css')
        .pipe(gulp.dest(outdir));
})

gulp.task("js", () => {
  gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/morphdom/dist/morphdom-umd.min.js',
    'assets/templates.js',
    'bower_components/nunjucks/browser/nunjucks-slim.min.js',
    'todo/static/js/todos.js',
  ])
  .pipe(concat('app.js'))
  .pipe(gulp.dest(outdir))
})

gulp.task("templates", () => {
    gulp.src('todo/templates/components/*.njk')
        .pipe(nunjucks.precompile({
            name: function(f) {
                return `components\/${f.relative}`;
            }
        }))
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(`${outdir}`))
})

gulp.task('serve:backend', function () {
    let devServerPort = process.env.PORT || 8000;
    process.env.PYTHONUNBUFFERED = 1;
    process.env.PYTHONDONTWRITEBITECODE = 1;
    child_process.spawn('python', ['manage.py', 'runserver', '0.0.0.0:' + devServerPort], {
        stdio: 'inherit'
    });
});

gulp.task('dev', function() {
    gulp.start('serve:backend');
    gulp.watch('todo/**/*.js', ['js']);
    gulp.watch('todo/templates/*.njk', ['js']);
});

gulp.task('default', ['js', 'css']);
