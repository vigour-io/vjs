"use strict";
var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Emitter = require('./emitter')

var on = new Base({
  $useVal:true
})

define( on , '$ChildConstructor', {
  value:Emitter ,
  configurable:true
})

var On = on.$Constructor

proto.$flags = {
  $on: function( val, event ) {

    if(!this.$on) {
      this.$on = new On(void 0, event, this, '$on')
    }

    var on = this.$on

    for(var key$ in val) {

      if(!on[key$]) {
        // console.log('create dispatcher', key$)
        //this checks if dispatchers event stamp is the stamp of setting it in the on
        on[key$] = new Emitter( void 0, void 0,  on, key$ )
        on[key$].$lastStamp = event.$stamp
      }
      //do a set use on.$flags for flags
      //more system ofcourse but this is kinda of the funcitonality
      on[key$].$addListener(val[key$])

    }
    
  }
}
