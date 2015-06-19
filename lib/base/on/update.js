var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

define( proto, '$update', {
  value:function( type, event ) {

    //event can just get the type

    if( this.$on && this.$on[ type ] ) {
      console.error(type, this.$path)
      this.$on[type].$update( event )
    }

    //this is super annoying --- now nested shit will go later
    //very good for , for example references
    //very bad for merges -- does not make sense

    //this is type unspecific 

    console.info('hey hello! im doing update stuff!', this.$path, event.$origin.$path)


    if( event.$origin === this && event.$postponed ) {
      //can be added to dynamicly
      for(var dispatcher$ = 0; event.$postponed[dispatcher$]; dispatcher$++) {
        event.$postponed[dispatcher$].$update( event, true )
      }
      event.$postponed = null
    }

    // return event
  },
  configurable:true
})