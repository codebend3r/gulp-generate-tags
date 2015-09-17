Gulp Generate Tags
====================
![gulp-generate-tags build status](https://travis-ci.org/crivas/gulp-generate-tags.svg?branch=master)

> Gulp plugin that will convert txt or csv files into a JSON project. Here is an example on how you set it up in Gulp.

```js
var generateTags = require('gulp-generate-tags')

gulp.task('tags', function () {

  return gulp.src(['app/on-click.tsv', 'app/on-load.tsv'])
    .pipe(generateTags('tags.json'))
    .pipe(gulp.dest('app/tags'))

});  
```

## Options

- delimiter - default is ',' (comma) to delimit
- newline - character for new line

```js
var generateTags = require('gulp-generate-tags')

gulp.task('tags', function () {

  return gulp.src(['app/on-click.txt', 'app/on-load.txt'])
    .pipe(generateTags('tags.json', {
      delimiter: '\t'
    }))
    .pipe(gulp.dest('app/tags'))

});  
```
