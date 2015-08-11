"use strict";

var Observable = require('../observable')
var Event = require('../event')

module.exports = new Observable({
  $define: {
    length: {
      value: 0,
      writable: true
    },
    $handleShifted: function(i) {
      var item = this[i]
      if(item._$parent === this) {
        item.$key = i
      } else if(item._$contextKey !== i){
        this.$createListContextGetter(i)
      }
    },
    $reset: function() {
      var base = this
      base.each(function(property, key){
        base[key] = null
        // property.$remove()
      })
      base.length = 0
    },
    $createListContextGetter: function( key ) {
      var value = this[key]
      if( value ) {
        var privateKey = '_'+key
        this[privateKey] = value
        define( this, key, {
          get: function(){
            var value = this[privateKey]
            if(value instanceof Base) { 
              if(value._$parent !== this) {
                value._$context = this
                value._$contextLevel = 0
                if(key !== value.$key) {
                  value._$contextKey = key
                }
              } else if( this._$context ) {
                value._$contextLevel = this._$contextLevel + 1
                value._$context = this._$context
              } else {
                value.$clearContext()
              } 
            }
            return value
          },
          set:function(val) {
            this[privateKey] = val
          },
          configurable:true
        })
      }
    }
  },
  $inject: [
    require( './push' ),
    require( './unshift' ),
    require( './splice' ),
    require( './sort' )
  ]
}).$Constructor

