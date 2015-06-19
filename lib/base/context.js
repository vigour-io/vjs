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
  value:function( key$ ) {
    var field = this[key$]
    if(field.$createContextGetter) {
      var privateKey = '_'+key$
      this[privateKey] = field

      for( var key$$ in field ) {
        if( key$$[0] !== '_' && !field['_'+key$$] ) {
          field.$createContextGetter( key$$ )
        }
      }

      define( this, key$, {
        get: function getter(){
          var field = this[privateKey]
          if(!this.hasOwnProperty( privateKey )) {
            field._$context = this
            field._$contextLevel = 0
          } else if( this._$context ) {
            field._$contextLevel = this._$contextLevel + 1
            field._$context = this._$context
          } else {
            field._$contextLevel = null
            field._$context = null
          }
          return field
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
