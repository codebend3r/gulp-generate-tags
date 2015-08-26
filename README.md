Gulp Generate Tags
====================
![gulp-generate-tags build status](https://travis-ci.org/crivas/gulp-generate-tags.svg?branch=master)

> Gulp plugin that will convert txt or csv files into a JSON project. Here is an example on how you set it up in Gulp.

## Options

- delimiter - default is ',' (comma) to delimit
- newline - character for new line

```js
var generateTags = require('gulp-generate-tags')

gulp.task('tags', function () {

  return gulp.src(['app/resource/tags/on-click.txt', 'app/resource/tags/on-load.txt'])
    .pipe(generateTags('ute-tags.json', {
      delimiter: '\t'
    }))
    .pipe(gulp.dest('app/resource/tags'))

});  
```
