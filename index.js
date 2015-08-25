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
  File = gutil.File,
  Concat = require('concat-with-sourcemaps'),
  PluginError = gutil.PluginError;

module.exports = function (file, options) {

  if (!file) {
    throw new PluginError('gulp-generate-tags', 'Missing file option for gulp-csv-converter');
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
    throw new PluginError('gulp-generate-tags', 'Missing path in file options for gulp-csv-converter');
  }

  /**
   * stream buffer per each file
   * @param file - file object in stream
   * @param enc - encoding of file in stream
   * @param cb - callback function
   */
  var bufferContents = function (file, enc, cb) {

    if (file.isStream()) {

      this.emit('error', new gutil.PluginError('gulp-generate-tags', 'Streams are not supported!'));
      cb();

    } else if (file.isNull()) {

      cb(null, file); // Do nothing if no contents

    } else {

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
   * if string has a hash in the string will return true
   * @param propertyName
   * @returns {boolean}
   */
  var hasHash = function (propertyName) {
    return propertyName.toString().indexOf('#') !== -1;
  };

  /**
   * check to see if key name on an object is a valid
   * ignores any param name with a hashtag
   * @param propertyName
   * @returns {boolean}
   */
  var isValidProperty = function (propertyName) {
    return !_.isNull(propertyName) && !_.isUndefined(propertyName) && propertyName !== '';
  };

  /**
   * converts csv to json
   * @param bufferedArray
   */
  var convertToObject = function (bufferedArray) {

    var lines,
      headers,
      propertyName,
      metaData,
      containerObject = {},
      projectNameSpace,
      eventType,
      currentTagObject = {},
      replaceRegex = /"/g,
      delimiter = opt.delimiter || ',',
      remove = opt.removeChars ? opt.removeChars.toString() : '',
      currentLine;

    _.each(bufferedArray, function (data) {

      // look at contents of each object and convert to string then split on new lines
      var convertedString = data.contents.toString('utf-8').replace(replaceRegex, '');

      convertedString = convertedString.replace(remove, '');

      lines = convertedString.split('\n');

      // save metaData to be index 0 of lines then split on delimiter
      metaData = lines[0].split(delimiter);

      // save headers to be index 1 of lines then split on delimiter
      headers = lines[1].split(delimiter);

      projectNameSpace = metaData[0];
      eventType = metaData[1];

      containerObject[projectNameSpace] = containerObject[projectNameSpace] || {};
      containerObject[projectNameSpace][eventType] = containerObject[projectNameSpace][eventType] || {};

      // loop through lines starting from index 2
      _.each(lines.slice(2, lines.length), function (eachLine) {

        currentLine = eachLine.split(delimiter);
        propertyName = currentLine[0];

        if (!propertyName || propertyName === '') {
          return;
        }

        var idPropName = projectNameSpace + '-' + eventType + '-' + propertyName;

        // check to see if it exists
        if (!_.isNull(containerObject[projectNameSpace][eventType][idPropName]) && !_.isUndefined(containerObject[projectNameSpace][eventType][idPropName])) {
          console.log(idPropName, 'already exists:', containerObject[projectNameSpace][eventType][idPropName]);
          return;
        } else {
          currentTagObject[idPropName] = {};
        }

        _.each(currentLine, function (eachProp, index) {

          // if not the first item in currentLine && prop value by header has a hashtag in string && eachProp is not an empty value
          if (index > 0 && !hasHash(headers[index]) && eachProp.toString() !== '') {
            currentTagObject[idPropName][headers[index]] = eachProp;
          }

        });

        containerObject[projectNameSpace][eventType][idPropName] = {
          type: eventType,
          data: currentTagObject[idPropName]
        };

      });

    });

    return JSON.stringify(containerObject);

  };

  /**
   *
   * @param cb - callback function
   */
  var endStream = function (cb) {

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

    var convertedCSV = convertToObject(bufferedContentObj);

    joinedFile.contents = new Buffer(convertedCSV);

    this.push(joinedFile);

    cb();

  };

  /**
   * returns streamed content
   */
  return through2.obj(bufferContents, endStream);

};
