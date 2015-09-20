"use strict";

var Base = require('./')
var util = require('../util')
var isPlainObj = util.isPlainObj

/**
 * @function setValue
 * @memberOf Base#
 * @todo find a better name
 * @param  {*} val
 *   The value that will be set on _input
 *   adds a listener on val if val is a base
 * @param  {Event} [event] Current event
 * @return {Base} this
 */

exports.setValueInternal = function( val, event ) {
  this._input = val
  return this
}

exports.setValue = function( val, event, resolveContextSet ) {
  if( val === this._input ) {
    //maybe add && val!==null

    return
  }

  if( val === null ) {
    this.remove( event )
    return this
  }

  if( resolveContextSet ) {
    return this.resolveContextSet( val, event )
  } else {
    return this.setValueInternal( val, event )
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
  var base = this
  var resolveContextSet = !nocontext && base._context
  if( isPlainObj(val) ) {
    if( resolveContextSet ) {
      base = base.resolveContextSet( val, event)
    } else {
      var changed
      for( var key in val ) {
        if( base._input === null ) {
          break;
        }
        if(key === 'val') {
          if( base.setValue( val[key], event, resolveContextSet ) ) {
            changed = true
          }
        } else {
          if( base.setKey( key, val[key], event, nocontext ) ) {
            changed = true
          }
        }
      }
      if(!changed) {
        return
      }
    }
  } else {
    base = base.setValue( val, event, resolveContextSet )
  }
  return base
}

/**
 * @function setKeyInternal
 * @memberOf Base#
 * @todo find a better name
 * @param  {String} key Key to be set on base
 * @param  {*} [val]
 *   The value that will be set on base[key]
 *   uses .set internaly
 *   checks for ._useVal|.useVal on val to overwrite default behaviour
 * @param  {Base} [property]
 *   property if base[key] is already defined
 * @param  {Event} [event]
 *   adds emiters to event if event is defined
 *   when false event emiters are not added
 */
exports.setKeyInternal = function( key, val, property, event, nocontext ) {
  if( property) {

    if( property._parent !== this ) {
      if( val === null ) {
        this[key] = null
        return this
      } else {
        var Constructor = property.Constructor
        if( !Constructor ) {
          throw new Error('cannot set property "'+ key+ '", it\'s reserved')
        } else {
          //this key can be changed

          //ook hier set pas later! -- super important
          this[key] = new Constructor( void 0, false, this, key )
          //double check if you rly want to return this
          this[key].set( val, event )
          return this[key]
        }
      }
    } else {
      //return property.set( val, event, nocontext )
      var ret = property.set( val, event, nocontext )
      return
      //moet wel ret returnen...
      // return true
    }
  } else {
    if( val !== null ) {
      this.addNewProperty( key, val, property, event )
      return this
    } else {
      return
    }
  }
}

exports.addNewProperty = function( key, val, property, event ) {
  //this is slow!
  this[key] = this.getPropertyValue( val, event, this, key )
  if( this.hasOwnProperty( '_Constructor' ) ) {
    this.createContextGetter( key )
  }
}

function checkUseVal( useVal, val, event, parent, key ) {
  val = useVal === true ? val : useVal
  if( !parent.strictType || parent.strictType( val ) ) {
    if( val instanceof Base) {
      if( !val._parent || val._parent === parent ) {
        val.key = key
        val._parent = parent
        return val
      }
    } else {
      return val
    }
  }
}

// exports.getPropertyValue = function( val, event, parent, key ) {
//   var useVal
//   if( val !== void 0 && ( useVal = val._useVal || val.useVal ) ) {
//     return checkUseVal( useVal, val, event, parent, key  )
//   } else {
//     return new parent.ChildConstructor( val, event, parent, key )
//   }
// }

exports.getPropertyValue = function( val, event, parent, key ) {
  if( val ) {
    var useVal
    if( useVal = val._useVal || val.useVal ) {
      return checkUseVal( useVal, val, event, parent, key  )
    } else if( val.useConstructor ) {
      return new val.useConstructor( val, event, parent, key )
    }
  }
  return new parent.ChildConstructor( val, event, parent, key )
}

/**
 * @function setKey
 * @memberOf Base#
 * Uses setKeyInternal or flag[key]
 * @param  {String} key
 *   Key set on base using setKeyInternal
 *   Checks if a match is found on Base.flags
 * @param  {*} [val]
 *   The value that will be set on base[key]
 * @param  {Event} [event] Current event
 */
exports.setKey = function( key, val, event, nocontext ) {
  if( this.flags[key] ) {
    return this.flags[key].call( this, val, event, nocontext )
  } else {
    return this.setKeyInternal( key, val, this[key], event, nocontext )
  }
}
