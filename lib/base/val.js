"use strict";

var Base = require('./')

/**
 * @name  origin
 * @type {base}
 */
exports.origin =  {
  get:function() {
    var reference = this
    while( reference._input instanceof Base ) {
      reference = reference._input
    }
    return reference
  }
}

exports.parseValue = function( previousValue, origin ) {
  if(!origin) {
    origin = this
  }
  var val = this.output || this._input

  if(val) {
    if( typeof val === 'function' ) {
      //make this into a funciton e.g. execGetterFunction bindGetter
      var context = this._bind && ( this._bind.output || this._bind._input ) || this

      //this thing can be removed and is only
      if( context ) {
        if( typeof context === 'function' ) {
          //send val as well -- take previous val into account in parseValue
          context = context.call(this, previousValue)
        } else if( context === 'parent' ) {
          //this will be replaced with a general path functionality (that includes)
          context = this.parent
        } else {
          context = this
        }
      }
      val = val.call(context, previousValue)
    } else if( val instanceof Base ) {
      if(val !== origin) {
        val = val.parseValue( void 0, origin )
      } else {
        console.error(
          'parsingValue from same origin (circular)',
          'path:', this.path,
          'origin:', origin.path
        )
      }
    } else {
      val = this.output || this._input
    }
  }

  if(val === void 0) {
    val = this
  }

  return val
}
/**
 * Returns the value of a base object
 * @name  val
 * @type {*}
 */
exports.val = {
  get:function() {
    return this.parseValue()
  },
  set:function( val ) {
    this.set( val )
  }
}

exports.input = {
  get:function() {
    var input = this._input
    if(input !== void 0) {
      if(input instanceof Base && input !== this) {
        return input.val
      } else {
        return input
      }
    }
    return void 0
  },
  set:function( val ) {
    this._input = val
  }
}
