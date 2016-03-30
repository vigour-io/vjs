/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
require('./object') //these things add extra methods to util for readability in a seperate module
require('./prop')

exports.isNode = (typeof window === 'undefined') ? true : false

/**
 * Add is similar to .push it returns the array instead of length
 * Can be extended to support more types e.g. add an object to another
 * @method add
 * @param  {Array}  obj Target
 * @param  {Object} add Object to add
 * @deprecated
 */
exports.add = function (obj, add) {
  if (add) obj.push.apply(obj, add);
  return obj
}

/**
 * Finds items in an array
 * @method checkArray
 * @param  {Object|Array}                 list  Defines the list where you want to search through, only uses .length field
 * @param  {Object}                       val   Defines the value you want to search for
 * @param  {Boolean|String|Number}        [index] When index is true return the index instead of true or false, when index and index !== true index is used as a field in objects in the array
 * @param  {String}                       [field] When field return field instead of index or true
 * @return {*}
 */
exports.checkArray = function (list, val, index, field) {
  var arr = index instanceof Array
  if(!list) return false
  for (var i = 0, l = list.length, t; i < l; i++) {
    t = list[i]
    if (index !== void 0) {
      if (index === true) {
        if (t === val) return i
      } else if (arr ? exports.path(t,index)===val : t[index] === val) return field ? t : i
    } else {
      if (t === val) return true
    }
  }
  return false
}

/**
 * Pass arguments (arguments) and return a new array, when index return a new array sliced from index
 * @method arg
 * @param  {Arguments} args        Arguments
 * @param  {Number}    [index = 0] When index return a new array sliced from index
 * @return {Array}
 */
exports.arg = function (args, index) {
  return Array.prototype.slice.call(args, !index ? 0 : index)
}

/**
 * Check if obj is empty exclude field names passed to list
 * @method empty
 * @param  {Object}       obj  Object
 * @param  {Object|Array} list Takes any object with .length
 * @return {Boolean}           True/false
 */
exports.empty = function (obj, list) {
  for (var i in obj) {
    if (!list || !this.checkArray(list, i)) return false
  }
  return true
}



