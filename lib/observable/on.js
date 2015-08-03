"use strict";

var Base = require('../base')
var Emitter = require('../emitter')
var util = require('../util')
var removeInternal = Base.prototype.$removeInternal


//-----------injectable part of the module----------

exports.$flags = {
  $on: require('./onConstructor')
}

exports.$define = {
  on: function( type, val, key, unique, event ) {
    if( typeof type !== 'string' ) {
      return this.on( '$change', type, val, key, unique )
    } else {
      var path
      var context
      var observable = this
      var level

      if( !this.$on || !this.$on[type] ) {
        var set = { $on: {} }
        set.$on[type] = {}

        context = this._$context

        if(context) {

          level = this._$contextLevel

          this.$resolveContextSet( set, false )

          //DO THIS IN CONTEXT also use in element node
          path = []
          var loop = observable
          for(var i = 0; i < level+1; i++) {
            path.unshift(loop._$key)
            loop = loop._$parent
          }
          observable = context
          for(var i in path) {
            //this will be GONE!
            observable = observable[path[i]]
          }
          //IN CONTEXT

        } else {
          this.set( set, false )
        }
      }

      observable.$on[type].$addListener( val, key, unique, event )
    }
  }
}
