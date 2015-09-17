'use strict';

var should = require('chai').should(),
  expect = require('chai').expect,
  assert = require('chai').assert,
  through = require('through2'),
  path = require('path'),
  gutil = require('gulp-util'),
  _ = require('underscore-node'),
  fs = require('fs'),
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

    var stream = generateTags('tags.json');

    stream.on('data', function (file) {

      var changedFile = file.contents.toString('utf-8');

      var jsonFile = JSON.stringify(changedFile);
      //var jsonParsed = JSON.parse(jsonFile);

      console.log('changedFile:', changedFile);
      console.log('jsonFile', jsonFile);
      //console.log('jsonParsed', jsonParsed);

      cb();

    });

    stream.on('end', function (file) {

      //var changedFile = file.contents.toString('utf-8');
      console.log('end --> file:', file);

    });

    stream.write(getFile('./test/fixtures/tags.tsv'));

  });

});
