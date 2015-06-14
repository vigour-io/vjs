//path moet instances meenemen is zn shit
var Base = require('./index.js')
var define = Object.defineProperty
var proto = Base.prototype
//$context

define( proto, '$createContextGetter', {
  value:function( key$ ) {
    this['_'+key$] = this[key$]
    define(this, key$, {
      get:function() {
        return this['_'+key$]
      },
      set:function(val) {
        this['_'+key$] = val
      }
    })
  }
})

define( proto, '$parent', {
  get:function() {
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
    while(parent && parent._name) {
      path.unshift(parent._name)
      parent = parent.$parent
    }
    return path
  }
})