"use strict";
var Base = require('../index.js')
var proto = Base.prototype
var define = Object.defineProperty

//dispacteh moet dit niet een instance van base zijn?
var dispatcher = new Base({
  // $val:[]
})

define( dispatcher, '$add', {
  value:function(val) {
    //check if its allready there etc!
    // console.log('lets add something to this dispacther!', val)
    if(!this._$val) {
      //!!!THIS IS COMPLETETLY NOT FINISHED!!!
      this._$val = []
    }

    //make seperate things for functions and Bases

    this._$val.push(val)
  },
  configurable:true
})

define( dispatcher , '$update', {
  value:function( event, force ) {

    if( this.$lastStamp === event.$stamp ) {

      console.error('BREAK', this.$path)

      return
    }

    //this will create complications when __bind__ is changing for stamps
    //tripple check how to handle effectifly
    var $bind = this.__$bind__ || this.$parent.$parent  //this.__$bind__ ||


    //slow lets make a lot faster -- has to check everywhere


    // && event.$origin !== $bind.$origin

    if(event.$origin !== $bind && !force ) {

      console.error('CATCH!', this.$path, event.$origin.$path)

      this.__$bind__ = $bind
      if(!event.$postponed) {
        event.$postponed = []
      }

      // for(var j in event.$postponed) {
      //   if(event.$postponed[j]===this) {
      //     console.error('allready have that!')
      //   }
      // }

      event.$postponed.push(this)
      
      return
    }

    var listeners = this._$val
    this.$lastStamp = event.$stamp

    for(var i = 0, len = listeners.length; i<len; i++) {

      if(listeners[i] instanceof Base) {

        console.info('hey hello!', listeners[i])
        listeners[i].$update('$change', event)

      } else {
        listeners[i].call( $bind, event)
      }

    }

    this.__$bind__ = null
    

  } ,
  configurable:true
})

var Dispatcher = module.exports = dispatcher.$Constructor
