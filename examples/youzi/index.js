var log = require('../../lib/util/log')
var perf = require('../../lib/util/perf')
//-------------------------------------------------------------

var Base = require('../../lib/base')

var bla = new Base({
  x:{
    y:{
      z: 'bla'
    }
  },
  flups:'bla'
})
bla._$key = 'bla'

var blurf = new bla.$Constructor({
  flups:'blurf',
  // x: {
  //   extraField:true
  // }
})

blurf._$key = 'blurf (instanceof bla)'

log('---- this is my test ----')

//dit is kut --- y,z nog geen getters dus dit werkt never
//proberen getters overal te doen? (nested dingen)
log( blurf.x.y.z.$path, '<---- my path' )

var gurk = new blurf.$Constructor({
  flups:'gurk'
})

gurk._$key = 'gurk'

//overwrite!
log( 'path: [', gurk.x.y.z.$path, ']' )

var hurk = new blurf.$Constructor({
  flups:'hurk'
})
hurk._$key = 'hurk'

log( 'path: [', hurk.x.y.z.$path, ']' )

log(' setting a inheritable prop on blurf' )

blurf.$set({
  bitchez:{
    aint:'shit'
  }
})

log(gurk.bitchez.$toString(), gurk.bitchez.aint.$path)

// var isPlainObj = require('lodash/lang/isPlainObject')

// var perf = require('../../lib/util/perf')

log('lets try some references!')

var a = new Base(1)
a.name = 'a'

var b = new Base(a)
b.name = 'b'

var c = new Base(b)
c.name = 'c'

log(c.$toString())

var d = new Base(function() {
  return Math.random()*9999
})

log('d', d.$toString())

log('lets try value getters and instances!')

var a = new Base(function() {
  return this.name.$val + ' blurf'
})
a.$set({
  name:'a'
})

//need $context : 'parent.parent' // funciton etc etc
var b = new a.$Constructor()
b.$set({
  name:'b'
})

log('a:', a.$val)

log('b:', b.$val)

var gurk = new Base({
  a: {
    b: {
      c:{
        $val:function() {
          return this.$path
        },
        $bind:function() {
          return this.$parent.$parent.$parent
        }
      }
    }
  }
})

gurk._$key = 'gurk'

var blurk = new gurk.$Constructor()

blurk._$key = 'blurk'

//add $origin 
//add $val getter for references

log('gurk --> ', gurk.a.b.c.$val)
log('blurk --> ', blurk.a.b.c.$val)

var bitchez = new Base('bitchez')

var blurf = new gurk.$Constructor({
  a: {
    testField:{
      thing:true
    },
    b: {
      testField:{
        nope:true,
        testField2:{
          thing2:'smurp'
        }
      },
      c: {
        $val:function() {
          //easy notation for this shit e.g.
          //$parent(3).
          return this.$val
        }
      }
    },
    b2:{
      testField2:{
        thing2:'lurf'
      }
    }
  },
  c:{
    testField:{
      haha:'blur'
    }
  },
  d:{

  },
  $val:bitchez
})

var f = new blurf.$Constructor()

// log("blurf.a.b.c.$lookUp('testField.thing.$lookUp.b.$lookDown.nope',true)", blurf.a.b.c.$lookUp('testField.thing.$lookUp.b.$lookDown',function(result){
//   if(typeof result === 'function'){
//     return true
//   }
// }))
// log("$lookDown('testField2.thing2','smurp')", blurf.$lookDown('testField2.thing2','smurp'))
// log("$get('$parent.$parent.$lookDown.c')", blurf.a.b.c.$get('$parent.$parent.$lookDown.c.$lookUp.testField.thing'))
log("blurf.a.b.$get('c.hey',{createThis:true})", blurf.a.b.$get('c.hey',{createThis:true}))

//nu default fields die iets speciaals doen zonder dingen hevier te maken
//e.g. transform etc etc (moet $bind of $context bind bij komen)

  perf({
    log:log,
    method:function() {
      // blurf.$get = 'a.testField'
      // var index
      // var _ = '_'
      var path = 'a.testField.thing'
      for(var i = 0; i < 2000000; i++) {
        blurf.$keys
        // f.a.b.c.$lookUp('testField')
        // var check = typeof obj === 'object'
        // blurf.$lookDown('testField2.thing2')
        // var str = 'blurblur'
        // var fn = {}
        // var test =typeof fn === 'function'//fn instanceof Function
        // var test = arr[i] === '_'
      }
    }
  })

// perf({
//   log:log,
//   method:function() {
//     for(var i = 0; i < 100000000; i++) {
//       // f.a.b.c.$lookUp('testField')
//       // blurf.a.b.c.$lookUp('testField.thing')
//     }
//   }
// })
