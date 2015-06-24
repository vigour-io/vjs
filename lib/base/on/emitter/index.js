"use strict";
var Base = require('../../index.js')
var proto = Base.prototype
var define = Object.defineProperty

//maybe call this emitter since its an event emitter

//dispacteh moet dit niet een instance van base zijn?
var emitter = new Base()

//this has to change completely!
define( emitter, '$add', {
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
//!!!!!

define( emitter , '$emit', {
  value:function( event, force ) {

    if( this.$lastStamp === event.$stamp ) {
      console.info('break update', this.$path)
      return
    }

    //this will create complications when __bind__ is changing for stamps
    //tripple check how to handle effectifly
    var $bind = this.__$bind__ || this.$parent.$parent  //this.__$bind__ ||

    //slow lets make a lot faster -- has to check everywhere
    // && event.$origin !== $bind.$origin

    if(event.$origin !== $bind && !force ) {
      console.info('postpone update', this.$path, event.$origin.$path)
      if(this.$postPonedStamp === event.$stamp) {
        console.info('allready postponed', this.$path, event.$origin.$path)
        return
      }
      this.__$bind__ = $bind
      event.$postpone(this)
      this.$postPonedStamp = event.$stamp
      return
    }

    var listeners = this._$val
    // this.$lastStamp = event.$stamp
    // this.$postPonedStamp = null

    for(var i = 0, len = listeners.length; i<len; i++) {
      if(listeners[i] instanceof Base) {
        // console.error('emitter - update base', listeners[i].$path, listeners[i]._$cachedStamp, event.$stamp)
        // listeners[i]._$lastChange = event.$stamp

        listeners[i].$emit('$change', event)
      } else {
        //fix bind completely (fixes functions on instances -- use context)
        //what to do? instances -- ugh
        listeners[i].call( $bind, event)
      }
    }
    // this.__$bind__ = null
  },
  configurable:true
})

var Emitter = module.exports = emitter.$Constructor
