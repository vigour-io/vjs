var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

define( proto, '$update', {
  value:function( type, event ) {

    if( this.$on && this.$on[ type ] ) {
      console.error(type, this.$path)
      this.$on[type].$update( event )
    }

    //this is super annoying --- now nested shit will go later
    //very good for , for example references
    //very bad for merges -- does not make sense

    if( event.$origin === this && event.$postponed ) {
      for(var dispatcher$ in event.$postponed) {
        event.$postponed[dispatcher$].$update( event, true )
      }
      event.$postponed = null
    }
    // return event
  },
  configurable:true
})