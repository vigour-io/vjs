//path moet instances meenemen is zn shit
var Base = require('./index.js')

Object.defineProperty( Base.prototype, '$path', {
  get:function() {
    var path = []
    var parent = this
    while(parent && parent._name) {

      console.log('hello!')
      //ook getter zodat het extendable is!
      //changing names changing parents etc
      //dit word $name (getter)
      path.unshift(parent._name)
      parent = parent.$parent
    }

    return path

  }
})