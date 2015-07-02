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
    if(key === '$bind' || key === '_$bind') {
      console.log('?!?!', key)
    }

    if(key === '_$bind') {
      console.error('???????????????????', key)
    }

    console.error('createContextGetter!', key)
    var value = this[key]
    

    if(value && value.$createContextGetter) {
      var privateKey = '_'+key
      this[privateKey] = value

      for( var val_key in value ) {
        if( val_key[0] !== '_' && !value['_'+val_key] ) {
          console.log('create nested shiner haha', val_key)
          value.$createContextGetter(val_key)
        }
      }

      var numberkey = Number(key)
      if(!isNaN(numberkey)) {
        key = numberkey
      }

      console.log('KEEEEE', key)
      console.error('createContextGetter!', key)

      console.log('--------====== WAT DEFINE', key, 'ALREADY HAVE:'
        , Object.keys(this)
        )

      for(var k in this) {
        console.log('KEY:', k)
      }

      console.error('createContextGetter!', key)
      define( this, key, {
        get: function getter(){
          console.log('get', key, privateKey)
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
