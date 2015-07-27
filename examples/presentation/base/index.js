var Base = require('../../../lib/base')
var Observable = require('../../../lib/observable')

var a = new Base({
  $key:'a',
  a:true,
  b:true,
  c:{
    a: {
      b: {
        c: {
          d:true
        }
      }
    }
  }
})

console.log(a)

var b = new a.$Constructor({
  $key:'b'
})

console.log(b, Object.getPrototypeOf(b) === a)

console.log( a.c === b.c )

console.log( a.c.a.b.c.d.$path )

console.log('-----------')

console.log( b.c.a.b.c.d.$path, b.c.a.b.c.d === a.c.a.b.c.d )


b.c.a.b.c.d.$val = 'what?'

console.log( b.c.a.b.c.d === a.c.a.b.c.d)

console.log( 
  b.c.a.b.c.d instanceof a.c.a.b.c.d.$Constructor
)

var perf = require('../../../dev/perf')



var constructConstructor = function(obj) {
 if(typeof obj === 'object') {
    if(!obj._constructor) {
      Object.defineProperty(
        obj, 
        '_constructor', {
        value: function(){}
        }
      )
    }
    for(var i in obj) {
      obj._constructor.prototype[i] = constructConstructor(obj[i])
    }
  }
}

var Constructor = function(){}

Constructor.prototype = {
  a: {
    b: {
      c: {
        d: true
      }
    }
  }
}

constructConstructor(Constructor.prototype)

console.log('---->', Constructor.prototype)

function createNewDeepObject(obj, attach) {
  if(obj._constructor) {
    attach = new obj._constructor()
  }
  for(var i in obj ) {
    attach[i] = createNewDeepObject( obj[i], attach[i])
  }
  return attach
}

var store = []

// perf(function() {
//   for(var i = 0 ; i < 1000000; i++ ) {
//     store.push( createNewDeepObject(Constructor.prototype) )
//   }
// })

var A = a.$Constructor

perf(function() {
  for(var i = 0 ; i < 1000000; i++ ) {
    store.push( new A() )
  }
})
