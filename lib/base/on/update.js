var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

define( proto, '$update', {
  value:function( type, event ) {
    if( this.$on && this.$on[ type ] ) {
      this.$on[type].$update( event )
    }
    // return event
  },
  configurable:true
})