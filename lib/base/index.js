'use strict'
var define = Object.defineProperty
/**
 * @namespace Base
 * Constructor of Base
 * @class
 * @param  {*} val - set value of the base object
 * @param  {Event} event - pass event, on base base constructor defaults to false
 * @param  {base} parent - parent object
 * @param  {string} key - key thats being set on a parent
 * @return {base}
 */
var Base = module.exports = function (val, event, parent, key, escape) {
  this.setParent(val, event, parent, key)
  if (val !== void 0) {
    this.set(val, event || false, true, escape)
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
  value () {
    var val
    for (let i = 0, length = arguments.length; i < length; i++) {
      val = arguments[i]
      for (let key in val) {
        let definition = val[key]
        let type = typeof definition
        if (type === 'function' || type !== 'object' || type instanceof Base) {
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
  require('./context/map'),
  require('./context/parent'),
  require('./context/store'),
  require('./context/path'),
  require('./property'),
  require('./inject'),
  require('./bind'),
  require('./val')
)

proto.define({
  _base_version: {
    value: 1
  }
})

proto.properties = require('./properties')

// not the correct location
proto.properties = {
  mapProperty (val) {
    this.define({
      mapProperty () {
        var result = val.apply(this, arguments)
        if (!result) {
          result = Base.prototype.mapProperty.apply(this, arguments)
        }
        return result
      }
    })
  }
}

proto.inject(
  require('../methods/each'),
  require('../methods/get'),
  require('../methods/lookUp'),
  require('../methods/serialize'),
  require('../methods/keys'),
  // require('../methods/length'),
  // require('../methods/first'),
  // require('../methods/last'),
  require('./uid/integer'),
  require('../methods/sibling')
)
