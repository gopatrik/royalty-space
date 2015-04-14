var metalsmith = require('metalsmith'),
  branch = require('metalsmith-branch'),
  collections = require('metalsmith-collections'),
  excerpts = require('metalsmith-excerpts'),
  markdown = require('metalsmith-markdown'),
  permalinks = require('metalsmith-permalinks'),
  serve = require('metalsmith-serve'),
  templates = require('metalsmith-templates'),
  watch = require('metalsmith-watch'),
  stylus = require('metalsmith-stylus'),
  ignore = require('metalsmith-ignore'),
  moment = require('moment');

var gulp = require('gulp');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');

gulp.task('metalsmith', function (done) {
  var siteBuild = metalsmith(__dirname)
    .metadata({
      site: {
        title: 'The Royal Space Program',
        url: 'https://slashie.org/'
      }
    })
    .use(ignore('./contents/templates/'))
    .use(markdown())
    .use(stylus())
    .use(templates({
      engine: 'jade',
      directory: './contents/templates',
      moment: moment
    }))
    .source('./contents')
    .destination('./build')

  .build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      done();
      console.log('$$$');
    }
  });
})

gulp.task('pre-build', ['metalsmith']);

// gulp.task('post-build', ['bower-files', 'image-files']);


gulp.task('build', function(callback) {
    runSequence('pre-build', callback);
});


gulp.task('reload', ['build'], function() {
    return browserSync.reload();
});

gulp.task('serve', ['build'], function() {
    return browserSync({
        open: false,
        notify: false,
        server: {
            baseDir: './build'
        }
    });
});

gulp.task('watch', function() {
    return gulp.watch(
        ['./contents/templates/**/*',
            './contents/**/*',
            './contents/templates/**/**/*',
            './contents/**/**/*',
            './contents/templates/**/**/**/*',
        './contents/**/**/**/*'], ['reload']);
});



gulp.task('default', ['serve', 'watch']);