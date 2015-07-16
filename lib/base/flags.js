"use strict";

/**
 * @flag $useVal
 * @memberOf Base#
 * @param {*} val 
 *   Overwrites default $set handler and uses val for the property your defining
 *   setting to true returns the current instance of Base
 */
exports.$useVal = function( val ) {
  this._$useVal = val
}

/**
 * @flag $key
 * @memberOf Base#
 * @param {String} val Sets key
 * @return {String} returns property key
 */
exports.$key = function( val ) {
  this._$key = val
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


