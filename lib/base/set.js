"use strict";

var Base = require('./')
var util = require('../util')

/**
 * @function $setValue
 * @memberOf Base#
 * @todo find a better name
 * @param  {*} val
 *   The value that will be set on _$val
 *   adds a listener on val if val is a base
 * @param  {Event} [event] Current event
 * @return {Base} this
 */
exports.$setValueInternal = function( val, event ) {
  this._$val = val
}

exports.$setValue = function( val, event ) {
  if( val === this._$val ) {
    return true
  }
  console.error('???', val)
  if( val === null ) {
    console.error('?@!#123')
    return this.remove( event )
  }
  return this.$setValueInternal( val, event )
}

/**
 * @function $set
 * @memberOf Base#
 * @param  {*} val The value that will be set on Base
 * @param  {Event} [event] 
 *   when false events are not executed
 * @return {Base} this
 */
exports.$set = function( val, event ) {
  if(util.isPlainObj(val)) {
    var changed
    for( var key$ in val ) {

      if( this._$val === null ) {
        console.log('....')
        break;
      }

      if(key$==='$val') {
        if( this.$setValue( val[key$], event ) !== true ) {
          changed = true
        }
      } else {
        if( this.$setKey( key$, val[key$], event ) !== true ) {
          changed = true
        }
      }
    }
    if(!changed) {
      return true
    }
  } else {
    if( this.$setValue( val, event ) === true ) {
      return true
    }
  }
  return event
}

/**
 * @function $setKeyInternal
 * @memberOf Base#
 * @todo find a better name
 * @param  {String} key Key to be set on base
 * @param  {*} [val] 
 *   The value that will be set on base[key]
 *   uses .$set internaly
 *   checks for ._$useVal|.$useVal on val to overwrite default behaviour
 * @param  {Base} [property]
 *   property if base[key] is already defined
 * @param  {Event} [event] 
 *   adds emiters to event if event is defined
 *   when false event emiters are not added
 */
exports.$setKeyInternal = function( key, val, property, event ) {
  if(property) {
    //things without parent may exist as well..
    if( property._$parent !== this ) {
      var Constructor = property.$Constructor
      if( !Constructor ) {
        //optimize this! maybe remove on production?
        throw new Error('cannot set property "'+ key+ '"')
      }
      this[key] = new Constructor( val, event, this )
    } else {
      property.$set( val, event )
      return true
    }
  } else {
    this.addNewProperty( key, val, property, event )
  }
}

exports.addNewProperty = function( key, val, property, event ) {
  this[key] = this.$getPropertyValue( val, event, this, key )
  if(this.hasOwnProperty( '_$Constructor' )) {
    this.$createContextGetter( this, key )
  }
}

exports.$getPropertyValue = function( val, event, parent, key ) {
  if(val !== void 0) {
    var useVal = val._$useVal || val.$useVal
    if(useVal) {
      val = useVal === true
        ? val
        : useVal

      if(!parent.$strictType || parent.$strictType(val)) {
        if( val instanceof Base) {
          if(!val._$parent || val._$parent === parent) {
            //!!!fix dit kan veel cleaner!!!
            val._$key = key
            val._$parent = parent
            return val
          }
        } else {
          return val
        }
      } 
    }
  }
  return new parent.$ChildConstructor( val, event, parent, key )
}

/**
 * @function $setKey
 * @memberOf Base#
 * Uses $setKeyInternal or $flag[key]
 * @param  {String} key 
 *   Key set on base using $setKeyInternal
 *   Checks if a match is found on Base.$flags 
 * @param  {*} [val] 
 *   The value that will be set on base[key]
 * @param  {Event} [event] Current event
 */
exports.$setKey = function( key, val, event ) {
  if( this.$flags[key] ) {
    return this.$flags[key].call( this, val, event ) 
  } else {
    return this.$setKeyInternal( key, val, this[key], event )
  }
}

