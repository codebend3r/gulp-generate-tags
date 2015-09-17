/**
 * Updated by crivas on 04/17/2015
 * Email: chester.rivas@gmail.com
 * Plugin Name: gulp-generate-tags
 */

'use strict';

var fs = require('fs'),
  through2 = require('through2'),
  path = require('path'),
  gutil = require('gulp-util'),
  _ = require('underscore-node'),
  convert = require('./lib/convert'),
  File = gutil.File,
  Concat = require('concat-with-sourcemaps'),
  PluginError = gutil.PluginError;

module.exports = function (file, options) {

  if (!file) {
    throw new PluginError('gulp-generate-tags', 'Missing file option for gulp-generate-tags');
  }

  var opt = options || {},
    bufferedContentObj = [],
    firstFile,
    fileName,
    concat,
    objIndex = 0;

  opt.newLine = gutil.linefeed;

  if (typeof file === 'string') {
    fileName = file;
  } else if (typeof file.path === 'string') {
    fileName = path.basename(file.path);
    firstFile = new File(file);
  } else {
    throw new PluginError('gulp-generate-tags', 'Missing path in file options for gulp-generate-tags');
  }

  /**
   * stream buffer per each file
   * @param file - file object in stream
   * @param enc - encoding of file in stream
   * @param cb - callback function
   */
  var bufferContents = function (file, enc, cb) {

    console.log('bufferContents');

    if (file.isStream()) {

      console.log('bufferContents - A');
      this.emit('error', new gutil.PluginError('gulp-generate-tags', 'Streams are not supported!'));
      cb();

    } else if (file.isNull()) {

      console.log('bufferContents - B');
      cb(null, file); // Do nothing if no contents

    } else {

      console.log('bufferContents - C');
      // set first file if not already set
      if (!firstFile) {
        firstFile = file;
      }

      // construct concat instance
      if (!concat) {
        concat = new Concat(false, fileName, opt.newLine);
      }

      bufferedContentObj.push({
        contents: file.contents
      });

      objIndex += 1;

      // add file to concat instance
      concat.add(file.relative, file.contents, file.sourceMap);

      cb();

    }

  };

  /**
   *
   * @param cb - callback function
   */
  var endStream = function (cb) {

    console.log('endStream');

    // no files passed in, no file goes out
    if (!firstFile || !concat) {
      cb();
      return;
    }

    var joinedFile;

    // if file opt was a file path
    // clone everything from the first file
    if (typeof file === 'string') {

      joinedFile = firstFile.clone({ contents: false });
      joinedFile.path = path.join(firstFile.base, file);

    } else {

      joinedFile = firstFile;

    }

    console.log('endStream -- convertedCSV');

    var convertedCSV = convert.convertToObject(bufferedContentObj);

    joinedFile.contents = new Buffer(convertedCSV, opt);

    this.push(joinedFile);

    cb();

  };

  /**
   * returns streamed content
   */
  return through2.obj(bufferContents, endStream);

};
