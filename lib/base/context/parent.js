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
  get: function () {
    var level = this._contextLevel
    var context
    var parent

    if (level) {
      context = this._context
      if (level === 1) {
        return context
      }
      parent = this._parent

      if (parent && !parent._context !== context) {
        parent._context = context
        parent._contextLevel = level - 1
      }
    } else {
      parent = this._parent
      if (parent && parent._context) {
        parent.clearContext()
      }
    }
    return parent
  }
  // },
  // set: function (val) {
  //   this._parent = val
  // }
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
  get: function () {
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
  get: function () {
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
