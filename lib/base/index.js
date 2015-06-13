"use strict";

module.exports = exports = function Base( val, parent ) {
  // console.log( val )
  this.$parent = parent
  this.$set( val )
}

//style guides
var proto = exports.prototype
var define = Object.defineProperty
//maybe make a util to make this smaller e.g. objects

define( proto, '$fromBase', {
  get:function() {
    //inheritor --- (setting in het object)
    //ie 10 does not support this! -- make fallback
    //maybe make a 
    return this.__proto__
    //this is the fastest but have to make different stuff for it...
  }
})

define( proto, '$parent', {
  get:function() {
    return this._$parent
    //dit is kut voor definition!
    //deze kan geflavoured worden voor element if !parent -- get dom parent
  },
  set:function(val) {
    this._$parent = val
    //dit is faya voor defininition!
    //dit zou een soort add zijn
  }
})

//defininition -- setting constructor for children

//children setting
define( proto, '$children', {
  value:{
    $constructor: exports 
    //self, Constructor, function() (returns a constructor)
    
    //$bind
    //allemaal default settings e.g. $call voor children
  },
  writable:true 
})


// define( proto, '$val', {
//   value:{
//     $constructor: exports 
//     //self, Constructor, function() (returns a constructor)
    
//     //$bind
//     //allemaal default settings e.g. $call voor children
//   },
//   writable:true 
// })

// define( proto, '$setValue', {
//   value: function(val) {
//   //dit is wat nu set is in vjs
//   //deze pakt de $set voor objecten


// }
// })

//$constructor moet shit setten opzichzelf? 
//om te bepalen wat voor constructor er terug word gestuurd ofzo?

//this should be a flavourable function -- but fine for now
//set has to be flavourable of course
define( proto, '$setKey', {
  value:function( key, value ) {
    //inheritor --- (setting in het object)

    //_val

    if(this[key] && this[key].$parent !== this) {
      //new instance /w copy needs to get more efficient
      this[key] = new this[key].$Constructor( value, this )
    } else if(this[key]) {
      //hier moet gekeken worden al voor proto shit... lastig
      this[key].$set( value )
    } else {
      // console.log(this.$children.$constructor, value)
      this[key] = new this.$children.$constructor( value, this )
    }
  }
})


define( proto, '_$val', {
  writable:true,configurable:true
})

//de set
define( proto, '$set', { value: function( val ) {
    if(val instanceof Object) {
      for( var key$ in val ) {
        // console.log( 'lets set!', key$ )
        this.$setKey( key$, val[key$] )
      }
    } else {
      //dit is beurs -- je wil neit dat dit 

      // define(this, '_$val', {value:val,writable:true,configurable:true})
      this._$val = val
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
define( proto, '$Constructor', {
  get:function() {
    //think where to store to properties?
    //plan in this!
    if(!this.hasOwnProperty( '_$Constructor' )) {
      // console.log('now lets create a class')
      //this may be way way to slow (define elke keer dat er iets gewrite meot worden)
      //double check for loops are a lot faster like this

      //could add it as a 'blacklisted field (just add _)'

      //descision time
      //this will be faster looping is slower
      define(this, '_$Constructor', {
        value:function derivedBase( val, parent) {
          //constructor moet ook configurable
          this.$parent = parent
          if(val) {
            this.$set( val )
          }
        }
      })
      //.constructor

      //make this use the name or something
      //do defintionios for non getters and setters
      this._$Constructor.prototype = this
    }
    return this._$Constructor
  }
})

require('./util')


//inject? keep inject?

// proto.



//prototype system
//on and listeners