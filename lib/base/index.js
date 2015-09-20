'use strict'
var define = Object.defineProperty

/**
 * @namespace Base
 * Contructor of Base
 * @param  {*} val set value of the base object
 * @param  {Event} [event] pass event, on base base constructor defaults to false
 * @param  {base} [parent] parent object
 * @param  {string} [key] key thats being set on a parent
 * @return {base}
 */
var Base = module.exports = function Base (val, event, parent, key) {
  this.setParent(val, event, parent, key)
  if (val !== void 0) {
    this.set(val, event || false, true)
  }
}

var proto = Base.prototype

/**
 * @function define
 * helper for Object.defineProperty on base classes
 * always to sets configurable to true
 * @memberOf Base#
 * @param {...object} Defines each object on the base
 */
define(proto, 'define', {
  value: function () {
    var val
    for (var i = 0, length = arguments.length; i < length; i++) {
      val = arguments[i]
      for (var key in val) {
        var definition = val[key]
        if (typeof definition === 'function' ||
            typeof definition !== 'object' ||
            typeof definition instanceof Base
        ) {
          definition = { value: definition }
        }
        definition.configurable = true
        define(this, key, definition)
      }
    }
  },
  configurable: true
})

// see base as one file, split up for convienience (not injectable)
proto.define(
  require('./constructor'),
  require('./set'),
  require('./remove'),
  require('./context'),
  require('./context/util'),
  require('./context/parent'),
  require('./setflags'),
  require('./inject'),
  require('./val')
)

proto.flags = require('./flags.js')

proto.inject(
  require('../methods/each'),
  require('../methods/get'),
  require('../methods/convert')
)
