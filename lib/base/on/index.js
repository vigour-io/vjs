"use strict";
var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty
var Dispatcher = require('./dispatcher')

var on = new Base({
  $useVal:true
})

//if you use this.... why do everything seperate in the new dispacther?
define( on , '$ChildConstructor', {
  value:Dispatcher ,
  configurable:true
})

var On = on.$Constructor

// define( proto , '$$on', {
//   set:function( val ) {
//   },
//   get:function() {
//   }
// })

proto.$flags = {
  $on: function( val, event ) {

    if(!this.$on) {
      this.$on = new On(void 0, event, this, '$on')
    }

    var on = this.$on

    // this.$on.$set({
      //use something like this to make ti easier
      //dispatcher also needs a good thing for updates etc
    // })

    // console.info(val)

    for(var key$ in val) {
      if(!on[key$]) {
        // console.log('create dispatcher', key$)
        on[key$] = new Dispatcher( void 0, void 0,  on, key$ )

        //this checks if dispatchers event stamp is the stamp of setting it in the on
        on[key$].$lastStamp = event.$stamp
      }
      on[key$].$add(val[key$])
    }

    //more bindigs zijn nodig
    
  }
}
