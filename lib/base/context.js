"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype


/**
 * @function $createContextGetter
 * @memberOf Base#
 * @param  {string} key Key to create the context getter for
 */
define( proto, '$createContextGetter', {
  value:function( key ) {

    var value = this[key]
    
    if(value && value.$createContextGetter) {
      var privateKey = '_'+key
      this[privateKey] = value

      for( var val_key in value ) {
        if( val_key[0] !== '_' && !value['_'+val_key] ) {
          value.$createContextGetter(val_key)
        }
      }

      // var numberkey = Number(key)
      // if(!isNaN(numberkey)) {
      //   key = numberkey
      // }

      define( this, key, {
        get: function getter(){
          // console.log('get', key, privateKey)
          var value = this[privateKey]
          if(value instanceof Base) { // this is needed because of list
            if(!this.hasOwnProperty( privateKey )) {
              value._$context = this
              value._$contextLevel = 0
            } else if( this._$context ) {
              value._$contextLevel = this._$contextLevel + 1
              value._$context = this._$context
            } else {
              value._$contextLevel = null
              value._$context = null
              value._$contextKey = null
            }  
          }
          return value
        },
        set:function(val) {
          this[privateKey] = val
        }
      })
    }

  }
})


/**
 * @function $createListContextGetter
 * @memberOf Base#
 * @param  {string} key Key to create the context getter for
 */
define( proto, '$createListContextGetter', {
  value:function( key ) {

    var value = this[key]
    
    if(value) {

      var privateKey = '_'+key
      this[privateKey] = value


      // // do we need this for list elements?:
      // for( var val_key in value ) {
      //   if( val_key[0] !== '_' && !value['_'+val_key] ) {
      //     value.$createContextGetter(val_key)
      //   }
      // }

      // var numberkey = Number(key)
      // if(!isNaN(numberkey)) {
      //   key = numberkey
      // }

      define( this, key, {
        get: function getter(){
          // console.log('get from list', key, privateKey)
          var value = this[privateKey]
          if(value instanceof Base) { // this is needed because of list

            if(value._$parent !== this) {
              value._$context = this
              value._$contextLevel = 0

              if(key !== value._$key) {
                value._$contextKey = key
              }
            } else if( this._$context ) {
              value._$contextLevel = this._$contextLevel + 1
              value._$context = this._$context
            } else {
              value._$contextLevel = null
              value._$context = null
              value._$contextKey = null
            } 

            // if(!this.hasOwnProperty( privateKey )) {
            //   value._$context = this
            //   value._$contextLevel = 0
            // } else if( this._$context ) {
            //   value._$contextLevel = this._$contextLevel + 1
            //   value._$context = this._$context
            // } else {
            //   value._$contextLevel = null
            //   value._$context = null
            // }  
          }
          return value
        },
        set:function(val) {
          this[privateKey] = val
        }
      })
    }

  }
})


/**
 * Parent of base object
 * @name  $parent
 * @memberOf Base#
 * @type {base}
 */
define( proto, '$parent', {
  get:function() {
    return this._$contextLevel === 0
      ? this._$context 
      : this._$parent
  },
  set:function(val) {
    this._$parent = val
  }
})
