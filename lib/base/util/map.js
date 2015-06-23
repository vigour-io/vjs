"use strict";
/**
 * @function $each
 * @memberOf Base#
 * @param  {Function} fn
 * @return {*}
 */
module.exports = function( fn, excludes ) {
  var arr =[]
  this.$each(function() { 
    arr.push(fn.apply(this, arguments)) 
  }, excludes)
  return arr
}