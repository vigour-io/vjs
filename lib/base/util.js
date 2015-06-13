var Base = require('./index.js')
var proto = Base.prototype


Object.defineProperty(proto, 'convert', {
  value:function() {
    var obj = {}
    //if value --->
    for(var key$ in this) {

      obj[key$] = this[key$].convert 
        && this[key$].convert() 
        || this[key$] 

      //hier ook ff if obj if value etc  

    }
    return obj
  }
})

Object.defineProperty(proto, 'toString', {
  value:function() {
    return JSON.stringify( this.convert(), false, 2)
  }
})

Object.defineProperty(proto, 'keys', {
  get:function() {
    var keys = []
    //this can be extra robust by caching and updating (speed)
    for(var key$ in this) {
      keys.push(key$)
    }
    return keys
  }
})


