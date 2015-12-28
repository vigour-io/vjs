'use strict'
/**
 * @property parent
 * Parent of base object
 * gets the context-resolved parent of a base
 * @memberOf Base#
 * @type {base|undefined}
 * @todo think about set, is this event behaviour we want to support?
 */
exports.parent = {
  get () {
    var context = this._context
    var parent
    if (context) {
      parent = this._parent
      // bit dirt here -- not allways correct
      // tink about useval
      if (parent === context) {
        parent._context = null
        return parent
      }
      if (!parent || Object.getPrototypeOf(context) === parent) {
        return context
      }
      if (parent && parent._context !== context) {
        parent._context = context
      }
    } else {
      parent = this._parent
      if (parent && parent._context) {
        parent._context = null
      }
    }
    return parent
  }
}

/**
 * @property path
 * gets the context-resolved path of a base
 * @memberOf Base#
 * @type {array}
 * @todo share more functionality
 * @todo perf tests (reverse at the end perhaps faster?)
 */
exports.path = {
  get () {
    var path = []
    var parent = this
    while (parent && parent.key !== void 0) {
      path.unshift(parent.key)
      parent = parent.parent
    }
    return path
  }
}

/**
 * @property _path
 * gets the real path of a base
 * @memberOf Base#
 * @type {array}
 */
exports._path = {
  get () {
    var path = []
    var parent = this
    while (parent && parent.key !== void 0) {
      path.unshift(parent.key)
      parent = parent._parent
    }
    return path
  }
}

/**
 * @function getRoot
 * gets the root of a base
 * @memberOf Base#
 * @type {base}
 */
exports.getRoot = function () {
  var parent = this
  var next = parent.parent
  while (next) {
    parent = next
    next = parent.parent
  }
  return parent
}
