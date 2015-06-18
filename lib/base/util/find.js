"use strict";

var helpers = require('./helpers')
var isPlainObj = helpers.isPlainObj
var getPath = helpers.getPath
var returnOptions = helpers.returnOptions
var returnPath = helpers.returnPath

/**
 * @function $find
 * @memberOf Base#
 * @param  {string|string[]} path Path or field to find
 * @param  {*} options {regexp} Results will be tested using rexexp
 * <br>{base|string|boolean} Results will be compared with optionsvalue
 * <br>{function} Will be called for each result
 * <br>{object} Can contain the following:
 * @param  {number} options.cap Will end search after x results
 * @param  {object} options.conditions Results will be tested by these conditions
 * @return {array} results
 */
module.exports = function hoi(path, options) {
  path = returnPath(path)

  var cap
  var conditions
  var index = 0
  var length = path.length
  var results = []

  if (options && isPlainObj(options)) {
    cap = options.cap
    options = returnOptions(options)
  }

  function searchObj(obj) {
    var result = getPath(obj, path, length, options)
    if (result) {
      results[index++] = result
    }
    if (cap === void 0 || index < cap) {
      for (var key$ in obj) {
        if (key$[0] !== '_') {
          searchObj(obj[key$])
        }
      }
    }
    return results
  }

  return searchObj(this)
}