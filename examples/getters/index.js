var log = console.log = require('../../lib/util/log')

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

var util = require('../../lib/util')
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
    b: {
      c: {
        $val:function() {
          //easy notation for this shit e.g.
          //$parent(3).
          return this.$val
        }
      }
    }
  },
  $val:bitchez
})

log( 'blurf .$val', blurf.$val )
log( 'blurf $origin', blurf.$origin )
log( 'blurf a.b.c nested .$val', blurf.a.b.c.$val )

//nu default fields die iets speciaals doen zonder dingen hevier te maken
//e.g. transform etc etc (moet $bind of $context bind bij komen)

// perf({
//   log:log,
//   method:function() {
//     for(var i = 0; i < 100000000; i++) {
//       util.isPlainObj(blurf)
//       // var bla = isFunction(blurf)
//     }
//   }
// })

log('---- test flag proto -----')

var bla = new Base({
  $flags: {
    gurken: function(val) {

    }
  }
})
// bla.$flags

