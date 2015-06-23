var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Event = require('./event')

//mayeb call this $emit
//more close /w on
define( proto, '$update', {
  value:function( type, event ) {
    
    //being able to create events!
    //e.g. update('$change')
    //create an event if its not there?

    if( this.$on && this.$on[ type ] ) {

      if(event === void 0) {
        console.warn('force $update from', this.$path)
        event = new Event()
        event.$origin = this
        //stamps per event type -- way better
        //choose my event type (bound to on for example)
        //--issue is you want to share over types...
      }

      this.$on[type].$update( event )

      

    }



    if( event && event.$origin === this && event.$postponed ) {
      //cannot use length postponed can grow while executing!
      for(var i = 0, dispatcher$;(dispatcher$ = event.$postponed[i++]);) {
        dispatcher$.$update( event, true )
      }
      event.$postponed = null
    }

   

    return event
  },
  configurable:true
})

//defer goes here