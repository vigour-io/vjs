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
  each (fn, filter, attach) {
    var length = this.length
    var val
    if (length) {
      if (filter) {
        val = eachArrayLikeFiltered(this, length, fn, filter, attach)
      } else {
        val = eachArrayLike(this, length, fn, attach)
      }
    } else {
      if (typeof fn !== 'function') {
        eachSet(this, fn, filter, attach)
      } else if (filter) {
        val = eachFiltered(this, fn, filter, attach)
      } else {
        val = eachDefault(this, fn, attach)
      }
    }
    return val
  }
}

exports.properties = {
  each (val, event) {
    this.each(val, void 0, event)
  }
}

function eachSet (target, set, filter, event) {
  target.each((property) => {
    property.set(set, event)
  }, filter)
}

function eachArrayLike (target, length, fn, attach) {
  for (let i = 0; i < length; i++) {
    let val = fn(target[i], i, target, attach)
    if (val) {
      return val
    }
  }
}

function eachArrayLikeFiltered (target, length, fn, filter, attach) {
  for (let i = 0; i < length; i++) {
    let iteratee = target[i]
    let val = filter(iteratee, i, target, attach) && fn(iteratee, i, target, attach)
    if (val) {
      return val
    }
  }
}

function eachDefault (target, fn, filter, attach) {
  var properties = target._properties
  if (properties) {
    for (let i in target) {
      let iteratee = target[i]
      let val = i[0] !== '_' && !properties[i] && iteratee !== null &&
        fn(iteratee, i, target, attach)
      if (val) {
        return val
      }
    }
  } else {
    for (let i in target) {
      let iteratee = target[i]
      let val = i[0] !== '_' && iteratee !== null && fn(iteratee, i, target, attach)
      if (val) {
        return val
      }
    }
  }
}

function eachFiltered (target, fn, filter, attach) {
  for (let i in target) {
    let iteratee = target[i]
    let val = i[0] !== '_' && iteratee !== null &&
      filter(iteratee, i, target, attach) &&
      fn(iteratee, i, target, attach)
    if (val) {
      return val
    }
  }
}
