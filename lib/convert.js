/**
 * Updated by crivas on 04/17/2015
 * Email: chester.rivas@gmail.com
 * Plugin Name: gulp-generate-tags
 */

'use strict';

var _ = require('underscore-node');

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
var convertToObject = function (bufferedArray, opt) {

  var lines,
    headers,
    propertyName,
    metaData,
    containerObject = {},
    projectNameSpace,
    eventType,
    currentTagObject = {},
    replaceRegex = /"/g,
    delimiter = isValidProperty(opt) && isValidProperty(opt.delimiter) ? opt.delimiter : ',',
    remove = isValidProperty(opt) && isValidProperty(opt.removeChars) ? opt.removeChars.toString() : '',
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
        if (index > 0 && isValidProperty(headers[index]) && !hasHash(headers[index]) && eachProp.toString() !== '') {
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

module.exports = {
  hasHash: hasHash,
  isValidProperty: isValidProperty,
  convertToObject: convertToObject
};
