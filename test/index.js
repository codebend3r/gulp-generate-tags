'use strict';

var should = require('chai').should(),
  expect = require('chai').expect,
  assert = require('chai').assert,
  through = require('through2'),
  path = require('path'),
  gutil = require('gulp-util'),
  _ = require('underscore-node'),
  fs = require('fs'),
  test = require('./test-stream'),
  generateTags = require('../index');

describe('generateTags', function () {

  var getFile = function (filePath) {
    return new gutil.File({
      path: filePath,
      cwd: __dirname,
      base: path.dirname(filePath),
      contents: fs.readFileSync(filePath)
    });
  };

  it('should be defined', function () {

    assert.isDefined(generateTags, 'generateTags is defined');

  });

  it('should covert tsv to json object', function (cb) {

    //var stream = generateTags('tags.json');

    console.log('assert.first', assert.first);

    test('./test/fixtures/tags-click.tsv', './test/fixtures/tags-pageload.tsv')
      .pipe(generateTags('tags.json'))
      //.pipe(assert.length(1))
      .pipe(through(function (d) {
        //d.contents.toString().should.eql('wadap');
        console.log('d -->', d.contents.toString());
      }))
      .pipe(assert.end(cb));

      /*
    stream.on('data', function (file) {

      var changedFile = file.contents.toString('utf-8');

      var jsonFile = JSON.stringify(changedFile);
      //var jsonParsed = JSON.parse(jsonFile);

      //console.log('changedFile:', changedFile);
      //console.log('jsonFile', jsonFile);
      //console.log('jsonParsed', jsonParsed);

      //cb();

    });

    stream.on('done', function (file) {

      //var changedFile = file.contents.toString('utf-8');
      console.log('done --> file:', file);

      //cb();

    });

    stream.write(getFile('./test/fixtures/tags-click.tsv'));
    stream.write(getFile('./test/fixtures/tags-pageload.tsv'));
    */

  });

});
