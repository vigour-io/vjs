var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

define( proto, '$update', {
  value:function( type, event ) {

    if( event.$origin === this && event.$postponed ) {
      for(var dispatcher$ in event.$postponed) {
        event.$postponed[dispatcher$].$update( event, true )
      }
      event.$postponed = null
    }

    if( this.$on && this.$on[ type ] ) {
      this.$on[type].$update( event )
    }
    // return event
  },
  configurable:true
})