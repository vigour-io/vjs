var Base = require('./index.js')
var proto = Base.prototype
var define = Object.defineProperty

define(proto, '$convert', {
  value:function() {
    var obj = {}
    //if value --->
    for(var key$ in this) {
      if(key$[0]!=='_') {
        obj[key$] = this[key$].$convert 
          && this[key$].$convert() 
          || this[key$] 
      }
      //hier ook ff if obj if value etc  
    }
    if(this._$val) {
      //temp fix for logging!
      //ook path voor refs , refs komen straks
      obj.$val = this._$val
    }
    return obj
  }
})

define(proto, '$toString', {
  value:function() {
    return JSON.stringify( this.$convert(), false, 2)
  }
})

define(proto, '$keys', {
  get:function() {
    var keys = []
    //this can be extra fast by caching and updating (speed)
    for(var key$ in this) {
      keys.push(key$)
    }
    return keys
  }
})


