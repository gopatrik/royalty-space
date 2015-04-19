var metalsmith = require('metalsmith');
var branch = require('metalsmith-branch');
var collections = require('metalsmith-collections');
var excerpts = require('metalsmith-excerpts');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var serve = require('metalsmith-serve');
var templates = require('metalsmith-templates');
var watch = require('metalsmith-watch');
var stylus = require('metalsmith-stylus');
var ignore = require('metalsmith-ignore');
var autoprefixer = require('metalsmith-autoprefixer');
var pagination = require('metalsmith-pagination');

var moment = require('moment');

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
    .use(markdown())
    .use(stylus())
    .use(autoprefixer())
    .use(collections({
      articles: {
        pattern: 'articles/*/*.html',
        sortBy: 'date',
        reverse: true
      }
    }))
  .use(branch('articles/**/**')
    .use(permalinks({
      pattern: 'art/:title',
      relative: false
    }))
  )
  // .use(branch('!articles/**/**.html')
  //   .use(branch('!index.md').use(permalinks({
  //     relative: false
  //   })))
  // )
    .use(pagination({
      'collections.articles': {
        perPage: 8,
        template: 'index.jade',
        first: 'index.html',
        path: 'page/:num/index.html',
        filter: function (page) {
          return !page.private
        },
        pageMetadata: {
          title: 'P E E K S P A C E'
        }
      }
    }))
    .use(templates({
      engine: 'jade',
      directory: './contents/templates',
      moment: moment
    }))
    .source('./contents')
    .destination('./build')
    .use(ignore('templates/*'))


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