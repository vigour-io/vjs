// define.js
var Base = require('./index.js')
var proto = Base.prototype
var define = Object.defineProperty
var merge = require('lodash/object/merge')

proto.$flags = {
  $define: function(val) {
    for(var key$ in val) {
      var definition = val[key$]
      if( typeof definition === 'function' 
      || typeof definition !== 'object' 
      || typeof definition instanceof Base 
      ) {
        definition = { value: definition, writable:true }
      }
      define( this, key$, merge(definition, { configurable:true }))
    }
  }
}

define( proto, '$define', {
  set:function( val ) {
    this._$flags.$define.call(this, val)
  }
})
