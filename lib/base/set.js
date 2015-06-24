"use strict";

var Base = require('./index.js')
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
    if(val instanceof Base) {
      //adds a listener, does not emit a $change event
      val.$set({ $on: { $change: this } }, false)
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
      for( var key$ in val ) {
        if(key$==='$val') {
          this.$setValue( val[key$], event )
        } else {
          this.$setKey( key$, val[key$], event )
        }
      }
    } else {
      this.$setValue( val, event )
    }
    if(event) {
      //this._$lastChange = event.$stamp
      this.$emit( '$change', event )
    }
    return this
  }
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
      }
    } else {
      //this is the spot to handle '$added/$removed' event can become hard  
      var ready
      if(val !== void 0){
        var useVal = val._$useVal || val.$useVal
        if(useVal) {
          val = useVal === true
            ? val
            : useVal

          if( val instanceof Base ) {
            if(!val._$parent) {
              val._$key = key
              val._$parent = this
              this[key] = val
              ready = true
            }
          } else {
            this[key] = val
            ready = true
          }
        }
      }
      
      if(!ready) {
        this[key] = new this.$ChildConstructor( val, event, this, key )
      }

      if(this.hasOwnProperty( '_$Constructor' )) {
        this.$createContextGetter.call(this, key)
      }


      //losse functie in on
      //
      if(event && this.$propertyStamp !== event.$stamp) {
        this.$propertyStamp === event.$stamp
        if(!event.$property) {
          event.$property = []
        }
        event.$property.push(this)
      }

    }
  }
})

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
      this.$flags[key].call( this, val, event )
    } else {
      this.$setKeyInternal( key, val, this[key], event )
    } 
  }
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






