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

      //THIS IS COMPLETETLY NOT FINISHED

      this._$val = []
    }
    this._$val.push(val)
  },
  configurable:true
})

define( dispatcher , '$update', {
  value:function( event, force ) {

    if( this.$lastStamp === event.$stamp ) {
      return
    }

    //this will create complications when __bind__ is changing for stamps
    //tripple check how to handle effectifly
    var $bind = this.__$bind__ || this.$parent.$parent  //this.__$bind__ ||

    if(event.$origin !== $bind && !force) {
      this.__$bind__ = $bind
      if(!event.$postponed) {
        event.$postponed = []
      }
      event.$postponed.push(this)
      return
    }

    var listeners = this._$val
    for(var i = 0, len = listeners.length; i<len; i++) {
      listeners[i].call( $bind, event)
    }

    this.__$bind__ = null
    this.$lastStamp = event.$stamp

  } ,
  configurable:true
})

var Dispatcher = module.exports = dispatcher.$Constructor
