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

exports.$setValue = function( val, event, nocontext ) {
  if( val === this._$val ) {
    return true
  }
  if( val === null ) {
    return this.remove( event )
  }

  if( !nocontext && this._$context ) {
    return this.$resolveContextSet( val, event )
  } else {
    return this.$setValueInternal( val, event )
  }
}

/**
 * @function set
 * @memberOf Base#
 * @param  {*} val The value that will be set on Base
 * @param  {Event} [event]
 *   when false events are not executed
 * @return {Base} this
 */
exports.set = function( val, event, nocontext ) {
  var realThis = this
  if(util.isPlainObj(val)) {
    if( !nocontext && this._$context ) {
      if( realThis = this.$resolveContextSet( val, event) === true ) {
        return true
      }
    } else {
      var changed
      for( var key$ in val ) {
        if( this._$val === null ) {
          break;
        }
        if(key$ === '$val') {
          if( this.$setValue( val[key$], event, nocontext ) !== true ) {
            changed = true
          }
        } else {
          if( this.setKey( key$, val[key$], event, nocontext ) !== true ) {
            changed = true
          }
        }
      }
      if(!changed) {
        return true
      }
    }
  } else {
    if( this.$setValue( val, event, nocontext ) === true ) {
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
 *   uses .set internaly
 *   checks for ._$useVal|.$useVal on val to overwrite default behaviour
 * @param  {Base} [property]
 *   property if base[key] is already defined
 * @param  {Event} [event]
 *   adds emiters to event if event is defined
 *   when false event emiters are not added
 */
exports.$setKeyInternal = function( key, val, property, event, nocontext ) {
  if( property) {
    if( property._$parent !== this ) {
      if( val === null ) {
        this[key] = null
      } else {
        var Constructor = property.$Constructor
        if( !Constructor ) {
          throw new Error('cannot set property "'+ key+ '"')
        } else {
          //this key can be changed
          this[key] = new Constructor( val, event, this, key )
        }
      }
    } else {
      property.set( val, event, nocontext )
      return true
    }
  } else {
    if( val !== null ) {
      this.$addNewProperty( key, val, property, event )
    } else {
      return event
    }
  }
}

exports.$addNewProperty = function( key, val, property, event ) {
  //this is slow!
  this[key] = this.$getPropertyValue( val, event, this, key )
  if( this.hasOwnProperty( '_$Constructor' ) ) {
    this.$createContextGetter( key )
  }
}

function checkUseVal( useVal, val, event, parent, key ) {
  val = useVal === true ? val : useVal
  if( !parent.$strictType || parent.$strictType( val ) ) {
    if( val instanceof Base) {
      if( !val._$parent || val._$parent === parent ) {
        val._$key = key
        val._$parent = parent
        return val
      }
    } else {
      return val
    }
  }
}

exports.$getPropertyValue = function( val, event, parent, key ) {
  var useVal
  if( val !== void 0 && ( useVal = val._$useVal || val.$useVal ) ) {
    return checkUseVal( useVal, val, event, parent, key  )
  } else {
    return new parent.$ChildConstructor( val, event, parent, key )
  }
}

/**
 * @function setKey
 * @memberOf Base#
 * Uses $setKeyInternal or $flag[key]
 * @param  {String} key
 *   Key set on base using $setKeyInternal
 *   Checks if a match is found on Base.$flags
 * @param  {*} [val]
 *   The value that will be set on base[key]
 * @param  {Event} [event] Current event
 */
exports.setKey = function( key, val, event, nocontext ) {
  if( this.$flags[key] ) {
    return this.$flags[key].call( this, val, event, nocontext )
  } else {
    return this.$setKeyInternal( key, val, this[key], event, nocontext )
  }
}
