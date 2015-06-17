"use strict";

var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype

define( proto, '$createContextGetter', {
  value:function( key$ ) {

    var field = this[key$]
    if(field.$createContextGetter) {

      this['_'+key$] = field

      for( var key$$ in field ) {
        if(key$$[0]!=='_' && !field['_'+key$$]) {

          field.$createContextGetter( key$$ )
        }
      }

      define( this, key$, {
        get:function() {
          var field = this['_'+key$]
          if(!this.hasOwnProperty( '_'+key$ )) {
            field._$context = this
            //can be optmized (check if context path and equal)
            field._$contextPath = [ key$ ]
          } else if( this._$context ) {
            //this has to become faster..
            //also a lot of potential to break (e.g. doing the same get twice...)
            field._$contextPath = this._$contextPath.concat([ key$ ])
            field._$context = this._$context
          } else {
            //clears context info
            field._$contextPath = null
            field._$context = null
          }
          return field
        },
        set:function(val) {
          this['_'+key$] = val
        }
      })

    }

  }
})

define( proto, '$parent', {
  get:function() {
    if(this._$contextPath) {
      if(this._$contextPath.length === 1) {
        return this._$context
      }
    }
    return this._$parent 
  },
  set:function(val) {
    this._$parent = val
  }
})





