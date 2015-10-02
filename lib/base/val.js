'use strict'
var Base = require('./')

/**
 * @function parseValue
 * parses output, can be references, itself, input value or ouput
 * bind is used as the callee to pass to functions defined in _input
 * @memberOf Base#
 * @param {*} previousValue  previous value continue parsing
 * @param {base} origin origin of current parsed value loop
 * @todo bind has to be used for emitters as well not only here!
 * @todo add more bind options e.g. parent.parent (be carefull with context!)
 */
exports.parseValue = function (previousValue, origin) {
  if (!origin) {
    origin = this
  }
  var val = this.output || this._input
  if (val) {
    if (typeof val === 'function') {
      // make this into a funciton e.g. execGetterFunction bindGetter
      var bind = this.bind || this

      console.log('?????', this.bind)
      // todo tommorow event, and bind -- multi event
        // (this._bind.output || this._bind._input) ||
        // this
        // this is still totaly wrong

      if (bind) {
        if (typeof bind === 'function') {
          // send val as well -- take previous val into account in parseValue
          bind = bind.call(this, previousValue)
        } else if (bind === 'parent') {
          // this will be replaced with a general path functionality (that includes)
          bind = this.parent
        } else {
          bind = this
        }
      }
      val = val.call(bind, previousValue)
    } else if (val instanceof Base) {
      if (val !== origin) {
        val = val.parseValue(void 0, origin)
      } else {
        console.warn(
          'parsingValue from same origin (circular)',
          'path:', this.path,
          'origin:', origin.path
        )
      }
    } else {
      val = this.output || this._input
    }
  }

  if (val === void 0) {
    val = this
  }

  return val
}

/**
 * @property origin
 * returns the origin of the value (resolved over references)
 * @type {base}
 */
exports.origin = {
  get: function () {
    var reference = this
    while (reference._input instanceof Base) {
      reference = reference._input
    }
    return reference
  }
}

/**
 * @property value
 * getter and setter to either parse value (on get) or call .set (on set)
 * @type {*}
 */
exports.val = {
  get: function () {
    return this.parseValue()
  },
  set: function (val) {
    this.set(val)
  }
}

/**
 * @property input
 * getter and setter
 * get input value if its different then the current callee
 * set sets the _input value (can be a normal object or anything else)
 * never fires listeners
 * @type {*}
 */
exports.input = {
  get: function () {
    var input = this._input
    if (input !== void 0) {
      if (input instanceof Base && input !== this) {
        return input.val
      } else {
        return input
      }
    }
    return void 0
  },
  set: function (val) {
    this._input = val
  }
}
