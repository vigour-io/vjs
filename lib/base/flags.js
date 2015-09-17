"use strict";

/**
 * @flag $useVal
 * @memberOf Base#
 * @param {*} val
 *   Overwrites default set handler and uses val for the property your defining
 *   setting to true returns the current instance of Base
 */
exports.$useVal = function( val ) {
  this._$useVal = val
}

exports.$output = function( val ) {
  this.$output = val
}

exports.$Constructor = function( val ){
  this.$Constructor = val
}

/**
 * @flag $key
 * @memberOf Base#
 * @param {String} val Sets key
 * @return {String} returns property key
 */
exports.$key = function( val ) {
  if( this.$key !== val ) {
    this.$key = val
    return this
  }
}

exports.$ChildConstructor = function( val ) {
  var typeOf = typeof val
  // if( typeOf === 'function' ) {
  //   val = val.call( this )
  // } else
  if( typeOf === 'string' ) {
    val = this[val]
  }
  this.define({
    $ChildConstructor: val
  })
}

/**
 * @flag $
 * @memberOf Base#
 * @param {object} val
 *   loop trough val and call methods on base for each key
 *   arrays are parsed for multiple arguments
 *   if you want to pass an array as an argument use [ [ ... ] ]
*/
exports.$ = function( val ) {
  for( var key$ in val ) {
    if(val instanceof Array) {
      this[key$].apply( this, val[key$] )
    } else {
      this[key$]( val[key$] )
    }
  }
}

/**
 * @flag $define
 * @memberOf Base#
 * @param {object} val
 *   convenience wrapper for define
*/
exports.$define = function( val ) {
  if( val instanceof Array ) {
    this.define.apply( this, val )
  } else {
    this.define( val )
  }
}

/**
 * @flag $inject
 * @memberOf Base#
 * @param {object} val
 *   convenience wrapper for inject
*/
exports.$inject = function( val ) {
  if( val instanceof Array ) {
    this.inject.apply( this, val )
  } else {
    this.inject( val )
  }
}
