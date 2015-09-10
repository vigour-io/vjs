"use strict";
var define = Object.defineProperty

/**
 * @namespace Base
 * @todo find a better name
 * @param  {*} val
 * @param  {Event} [event]
 * @param  {base} [parent]
 * @param  {string} [key]
 * @return {base}
 */
var Base = module.exports = function Base( val, event, parent, key ) {
  this.setParent( val, event, parent, key )
  if( val !== void 0 ) {
    this.set( val, event || false, true  )
  }
}

var proto = Base.prototype

define( proto, 'define', {
  value: function() {
    var val
    for( var i = 0, length = arguments.length; i < length; i++ ) {
      val = arguments[i]
      for( var key$ in val ) {
        var definition = val[key$]
        if( typeof definition === 'function' ||
            typeof definition !== 'object' ||
            typeof definition instanceof Base
        ) {
          definition = { value: definition }
        }
        definition.configurable = true
        define( this, key$, definition )
      }
    }
  },
  configurable:true
})

//you can see base as one file, split up for convienience (not injectable)
proto.define(
  require('./constructor'),
  require('./set'),
  require('./remove'),
  require('./context'),
  require('./context/util'),
  require('./setflags'),
  require('./inject'),
  require('./val')
)

proto.$flags = require('./flags.js')

proto.inject(
  require('../methods/each'),
  require('../methods/get')
)
