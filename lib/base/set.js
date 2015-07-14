"use strict";

var Base = require('./')
var define = Object.defineProperty
var proto = Base.prototype
var util = require('../util')
var flags = require('./flags.js')
var Event = require('./on/event')

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
define( proto, '$setValue' , {
  value: function(val, event) {

    //hier ook cachen voor change!
    if(val === this._$val ) {
      return true
    }

    //make this better and optimize!
    if( val instanceof Base) {
      val.on( '$change', this )
      // val.$set({ $on: { $change: this } }, false)
      this.$emit( '$reference', event, this._$val )
    } else if( this._$val instanceof Base ) {
      this.$emit( '$reference', event, this._$val )
    }

    this._$val = val
  }
})

/**
 * @function $set
 * @memberOf Base#
 * @param  {*} val The value that will be set on Base
 * @param  {Event} [event] 
 *   Current event, will be created if undefined.
 *   when false events are not executed
 *   emits a $change event if an event is available
 * @return {Base} this
 */
define( proto, '$set', { 
  value: function( val, event ) {

    if( event === void 0 ) {
      event = new Event()
      event.$val = val
      event.$origin = this
    }
    
    if(util.isPlainObj(val)) {
      var changed
      for( var key$ in val ) {
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
    if(event) {
      this.$emit( '$change', event )
    }
    return event
  },
  configurable:true
})

/**
 * @function $setKeyInternal
 * @memberOf Base#
 * @todo find a better name
 * @todo add a return value based on change happened or not
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
define( proto, '$setKeyInternal', {
  value:function( key, val, property, event ) {
    if(property) {
      if(property._$parent !== this) {
        this[key] = new property.$Constructor( val, event, this )
      } else {
        property.$set( val, event )
        //updates do not bubble 
        return true
      }
    } else {
      //this is the spot to handle '$added/$removed' event can become hard  
      
      //make this part a function and optional (remove strictType)
      //reduc instead of add (add for specifics)
      this[key] = $getPropertyValue(val, event, this, key)

      if(this.hasOwnProperty( '_$Constructor' )) {
        this.$createContextGetter.call( this, key )
      }

      if(event) {
        this.$emit('$property', event, key )
      }
    }
  }
})

var $getPropertyValue = exports.$getPropertyValue = function $getPropertyValue(val, event, parent, key) {
  if(val !== void 0) {
    var useVal = val._$useVal || val.$useVal
    if(useVal) {
      val = useVal === true
        ? val
        : useVal

      if(!parent.$strictType || parent.$strictType(val)) {
        if( val instanceof Base) {
          if(!val._$parent) {
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
define( proto, '$setKey', {
  value:function( key, val, event ) {
    // if(bla[key])
    //create event here if its not there yet extra check feels bit nasty
    if( this.$flags[key] ) {
      return this.$flags[key].call( this, val, event ) 
    } else {
      return this.$setKeyInternal( key, val, this[key], event )
    }
  }
})

define( proto, '$remove', {
  value:function() {
    if(this._$parent) {
      //moelijke is de listeners
      
    }
  },  
  configurable:true
})

proto.$flags = {
  /**
   * @flag $useVal
   * @memberOf Base#
   * @param {*} val 
   *   Overwrites default $set handler and uses val for the property your defining
   *   setting to true returns the current instance of Base
   */
  $useVal:function(val) {
    this._$useVal = val
  },
  /**
   * @flag $key
   * @memberOf Base#
   * @param {String} val Sets key
   * @return {String} returns property key
   */
  $key: function(val) {
    this._$key = val
  }
}

require('./define')