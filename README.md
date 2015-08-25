Gulp Generate Tags
====================

> Gulp plugin that will convert txt or csv files into a JSON project. Here is an example on how you set it up in Gulp.

## Options

delimiter - default is ',' (comma) to delimit
newline - character for new line

    var generateTags = require('gulp-generate-tags')

    gulp.task('tags', function () {

      return gulp.src(['app/resource/tags/on-click.txt', 'app/resource/tags/on-load.txt'])
        .pipe(generateTags('ute-tags.json', {
          delimiter: '\t'
        }))
        .pipe(gulp.dest(config.app + '/resource/omniture'))

    });
