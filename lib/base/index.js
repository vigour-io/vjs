"use strict";

module.exports = exports = function Base( params ) {
  this.set( params )
}

var proto = exports.prototype
var define = Object.defineProperty
//maybe make a util to make this smaller e.g. objects


define( proto, 'fromFibre', {
  get:function() {
    //inheritor --- (setting in het object)

    //ie 10 does not support this!
    return this.__proto__
    //this is the fastest but have to make different stuff for it...
  }
})

//this should be a flavourable function -- but fine for now
//set has to be flavourable of course
define( proto, 'setKey', {
  value:function( key, value ) {
    //inheritor --- (setting in het object)
    this[key] = value
  }
})

define( proto, 'set', { value: function( obj ) {
    for( var key$ in obj ) {
      // console.log( 'lets set!', key$ )
      this.setKey( key$, obj[key$] )
    }
  }
})

//get and set stream

//dit is kut -- write en enumarable is weg -- balen en kut met peren
//blacklist voelde niet zo nice....
// define( proto, '_class', {
//   enumerable:false,
//   writable:true,
//   configurable:true
// })

define( proto, 'Class', {
  get:function() {
    //think where to store to properties?
    //plan in this!
    if(!this.hasOwnProperty('_class')) {

      // console.log('now lets create a class')
      //this may be way way to slow (define elke keer dat er iets gewrite meot worden)
      //double check for loops are a lot faster like this

      define(this, '_class', {
        value:function derivedFibre(params) {
          //constructor moet ook configurable
          if(params) {
            this.set(params)
          }
        }
      })
      //make this use the name or something
      this._class.prototype = this
    }

    return this._class

  }
})

require('./util')


//inject? keep inject?

// proto.



//prototype system
//on and listeners