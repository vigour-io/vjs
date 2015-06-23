var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

define( proto, '$update', {
  value:function( type, event ) {
    if( this.$on && this.$on[ type ] ) {
      this.$on[type].$update( event )
    }
    if( event.$origin === this && event.$postponed ) {
      console.error(event.$postponed)
      for(var dispatcher$ = 0; event.$postponed[dispatcher$]; dispatcher$++) {
        event.$postponed[dispatcher$].$update( event, true )
      }
      event.$postponed = null
    }
    return event
  },
  configurable:true
})

//defer goes here