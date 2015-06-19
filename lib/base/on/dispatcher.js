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

      //regel dit ff heel goed wat gebeurd er als inherit -- keep everything??

      //seem ineffiecient

      //maybe remove all listeners except things that are bound?

      //maybe make a copy at least

      //(against interfectence)

      //use nested arrays perhaps?

      //maybe refrain from using array bit make listener /w a stamp (stamp is unique id)

      //listeners are set using a stamp so could work

      //!!!THIS PARET IS FAR FAR FROM DONE!!!!

      //argh argh argh, dont want to overwrite -- dont want to copy shit when adding a listener...

      //hard hard hard

      //.on is going to be the method for on 
      //.is as well
      // this way it is easier to seperate

      this._$val = []
    }
    this._$val.push(val)
  },
  configurable:true
})

define( dispatcher , '$update', {
  value:function( event, force ) {

    if( this.$lastStamp === event.$stamp ) {
      // console.error('BREAK UPDATE STAMP IS SAME')
      // this.__$bind__ = null
      return
    }

    var $bind = this.$parent.$parent  //this.__$bind__ ||

    // if(event.$origin === $bind) {
    //   console.info('THIS IS THE ORIGIN!', event.$stamp, this.$path)

    //   for(var dispatcher$ in this.$postponed) {
    //     this.$postponed[dispatcher$].$update( event, true )
    //   }

    //   event.$postponed = null

    // } else if(!force) {
    //   this.__$bind__ = $bind
    //   event.$postponed.push(this)
    //   console.info('!NOT THE ORIGIN!', this.$path, event.$stamp)
    //   return
    // }

    console.info('exec dispatcher')

    var listeners = this._$val
    for(var i = 0, len = listeners.length; i<len; i++) {
      //context correctors!

      //dit ff heel fast maken later
      listeners[i].call( $bind, event)
    }

    // this.__$bind__ = null
    this.$lastStamp = event.$stamp

  } ,
  configurable:true
})

var Dispatcher = module.exports = dispatcher.$Constructor
