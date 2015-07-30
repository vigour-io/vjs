"use strict";

var Base = require('./')
var util = require('../util')

/**
 * @function setValue
 * @memberOf Base#
 * @todo find a better name
 * @param  {*} val
 *   The value that will be set on _$val
 *   adds a listener on val if val is a base
 * @param  {Event} [event] Current event
 * @return {Base} this
 */

// var cnt = 0

exports.setValueInternal = function( val, event ) {
  this._$val = val
}

exports.setValue = function( val, event, nocontext ) {
  if( val === this._$val ) {
    return true
  }
  if( val === null ) {
    return this.remove( event )
  }
  // console.log(nocontext)
  if( !nocontext && this._$context ) {
    // cnt++
    // if(cnt > 50) {
    //   return true
    // }

    // console.log('this is val', val, this.$path)

    return this.$resolveContextSet( val, event ) 
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

  //i have this in here
  //what if i start resolving stuff?
  //  this will not be acureate anymore

  var realThis = this

  if(util.isPlainObj(val)) {

    //true and event

    //void 0 -- nothing happened
    //this (or the resolved this)

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
        if(key$==='$val') {
          // console.log('?', nocontext, key$ )
          if( this.setValue( val[key$], event, nocontext ) !== true ) {
            changed = true
          }
        } else {
          // console.log(key$, '???', nocontext)
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
    // console.log('2?', nocontext)
    if( this.setValue( val, event, nocontext ) === true ) {
      return true
    }
  }

  //if resolvedconterxt -- this is still the original
  // a.b.c.d
  // 'b.b.c.d' !== a.b.c.d
  return event
}

/**
 * @function setKeyInternal
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
exports.setKeyInternal = function( key, val, property, event, nocontext ) {

  // console.error('@!#!@#!@#?')
  if( property) {
    //things without parent may exist as well..
    if( property._$parent !== this ) {
      //make this a function (perf tests)
      if( val === null ) {
        //double check if this is correct!
        this[key] = null
      } else {
        var Constructor = property.$Constructor

              // console.log('???', property, key)


        if( !Constructor ) {
          // this[key] = val
          //optimize this! maybe remove on production?
          throw new Error('cannot set property "'+ key+ '"')
        } else {
          this[key] = new Constructor( val, event, this, key )
        }
      }
    } else {
      // if( property.set ) {
      
      //wrong!#@!#!@

      // console.log('???')

      property.set( val, event, nocontext )
      //empty guard

      // } else {
      //   //todo double check
      //   console.warn('.......', val, key)
      //   this[key] = val
      // }
      return true
    }
  } else {
    if( val !== null ) {
      this.addNewProperty( key, val, property, event )
    } else {
      return event
    }
  }
}

exports.addNewProperty = function( key, val, property, event ) {
  this[key] = this.$getPropertyValue( val, event, this, key )
  if( this.hasOwnProperty( '_$Constructor' ) ) {
    this.$createContextGetter( key )
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
            //!!!fix can become way cleaner!!!
            // console.error('?', key)
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
 * @function setKey
 * @memberOf Base#
 * Uses setKeyInternal or $flag[key]
 * @param  {String} key 
 *   Key set on base using setKeyInternal
 *   Checks if a match is found on Base.$flags 
 * @param  {*} [val] 
 *   The value that will be set on base[key]
 * @param  {Event} [event] Current event
 */
exports.setKey = function( key, val, event, nocontext ) {
  if( this.$flags[key] ) {
    return this.$flags[key].call( this, val, event, nocontext ) 
  } else {
    return this.setKeyInternal( key, val, this[key], event, nocontext )
  }
}

