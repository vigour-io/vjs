'use strict'

/**
 * @function each: iterates in an array or object passed as context(this)
 * @memberOf Base
 * default excludes fields starting with "_",
 * fields that are nulled and fields in ._properties["field"]
 * @param  {function} fn
 *  the function in which will be executed for every item
 *  or value/key in the array/object
 * @param {function} excludes
 *  a function or string (only allowed for objects) to be ignored when iterating
 *  overrirdes default fields in ._properties["field"] exclusion
 * @param {*} attach - variable to passon to exclude and fn
 * @returns {*} returns this for chainable stuff
 */
exports.define = {
  each: function (fn, excludes, attach) {
    var length = this.length
    if (length) {
      if (excludes) {
        eachArrayLikeExclude(this, length, fn, excludes, attach)
      } else {
        eachArrayLike(this, length, fn, attach)
      }
    } else {
      if (excludes) {
        eachExclude(this, fn, excludes, attach)
      } else {
        eachDefault(this, fn, attach)
      }
    }
    return this
  }
}

function eachArrayLike (target, length, fn, attach) {
  for (var i = 0; i < length; i++) {
    if (fn(target[i], i, target, attach)) {
      return
    }
  }
}

function eachArrayLikeExclude (target, length, fn, excludes, attach) {
  for (var i = 0; i < length; i++) {
    var iteratee = target[i]
    if (!excludes(iteratee, i, target, attach) && fn(iteratee, i, target, attach)) {
      return
    }
  }
}

function eachDefault (target, fn, excludes, attach) {
  var properties = target._properties
  var i
  var iteratee
  if (properties) {
    for (i in target) {
      iteratee = target[i]
      if (i[0] !== '_' &&
        !properties[i] &&
        iteratee !== null &&
        fn(iteratee, i, target, attach)
      ) {
        return
      }
    }
  } else {
    for (i in target) {
      iteratee = target[i]
      if (i[0] !== '_' && iteratee !== null && fn(iteratee, i, target, attach)) {
        return
      }
    }
  }
}

function eachExclude (target, fn, excludes, attach) {
  for (var i in target) {
    var iteratee = target[i]
    if (i[0] !== '_' &&
      iteratee !== null &&
      !excludes(iteratee, i, target, attach) &&
      fn(iteratee, i, target, attach)
    ) {
      return
    }
  }
}
