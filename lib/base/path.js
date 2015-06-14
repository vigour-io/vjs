"use strict";

//path moet instances meenemen is zn shit
var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype


window.cnt =  0
window.setCnts =  0

define( proto, '$createContextGetter', {
  value:function( key$ ) {
    this['_'+key$] = this[key$]

    for(var key$$ in this[key$]) {
      if(key$$[0]!=='_' && !this[key$]['_'+key$$]) {
        // console.log(key$)
        //dit is vrij heftig ofc
        this[key$].$createContextGetter( key$$ )
      }
    }


    define(this, key$, {
      get:function() {
        
        var field = this['_'+key$]

        window.cnt ++
        // console.log(this._name, 'is getting: ', key$)
        //if context && hasOwnproperty && !path --- reset context everywhere

        if(!this.hasOwnProperty( '_'+key$ )) {

          // console.log( '---> lets do some $context', key$, this.$path )

          field._$context = this

          if(!field._$contextPath) {
            field._$contextPath = [ key$ ]
          }

          //here it has to get added to something ... we need the path information

        } else if( this._$context ) {

          //how to reset????

          // console.log( 'this has some $context we have to resolve -->', 
            // key$, '-->', 
            // this._$context.$path
          // )

          if(!field._$contextPath) {
            field._$contextPath = this._$contextPath.concat([ key$ ])
          }

          // console.log( 'contextPath:', field._$contextPath )

          // field._$contextPath.push( key$ )

          field._$context = this._$context

        }

        return field
      },
      set:function(val) {
        window.setCnts++
        this['_'+key$] = val
      }
    })
  }
})

define( proto, '$parent', {
  get:function() {

    if(this._$contextPath) {
      // console.log(this._name, 'cpath:', this._$contextPath)
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

define( proto, '$path', {
  get:function() {
    var path = []
    var parent = this
    while(parent && parent._$name) {
      path.unshift(parent._$name)
      parent = parent.$parent
    }
    return path
  }
})