var log = require('../../lib/util/log')

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

log('gurk wtf is up with $bind?', gurk)

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
      log('hey its some gurky gurk'+val)
    }
  }
})

bla.$set({
  gurken:' --->>>>?'
})

var gurken = new Base({
  poedel:'slap'
})

var vv = new bla.$Constructor({
  $flags: {
    xxx:function(val) {
      log('hey its a xxxx!'+val)
    },
    yuzi: function( val ) {
      log( 'ITS YUZI!', val )
      //easy interface maken voor half dingen

    }
  },
  yuzi:'hee!'
})

vv.$flags = {
  guffel:function( val ) {
    console.log('guffel!', val)
  }
}

var xxx = new gurken.$Constructor()
// xxx.$override = true

var blaxxx = new gurken.$Constructor({
  // $val:'hello!',
  $useVal:true 
})


//settings reference will try to find it somehwere?
//think of a smart universal way to sync this shit

//mischien true vervangen met 'self' ofzo iig iets minder danger pakken

var gggg = new gurken.$Constructor({blurf:'blargh'})
gggg._$key = 'ggggg'

vv.$set({
  // hatsa:new blaxxx.$Constructor(),
  // youri:{ $useVal: 'YOURI STRING!' },
  hatsap: gggg,
  xxxx: new blaxxx.$Constructor()
})


vv.$flags = {
  andre:function(val) {
    alert(val)
    this.__gurk__ = val
  }
}

log(vv.$toString())

// document.body.innerHTML = ''

var X = new Base({
  $val:'x',
  $useVal:true
})

X._$key = 'X'

var Y = new Base({
  $val:'y',
  myX: X
})

Y._$key = 'Y'

var Z = new Base({
  $val:'z',
  myX: Y.myX
})

Z._$key = 'Z'

log('X:',X.$toString(),'Y:',Y.$toString(),'Z:',Z.$toString())

log('------ now some fake operators ------')

var FakeOperator = new Base({
  $bind:'$parent',
  huppeldepup:'<span>fake OPERATOR!</span>',
  $val:'GHELLO IM AN a fake OPERATOR!'
}).$Constructor

var gurk = new Base({
  $flags: {
    $transformer: new FakeOperator({ TRANSFORMERS: '<span>YES</span>'}),
    $add: FakeOperator
  }
})

gurk.$set({
  $val:'I AM GURK!',
  $transformer:function() {
    return 'xxxx'
  },
  $add:Z
})

log(gurk.$toString())
log('no transformer for me', new Base({$transformer:'bla'}).$toString())

document.body.innerHTML = ''
console.clear()

log('------ now some REAL operators ------')

var a = new Base({
  $val:100,
  $add:200
})

log('?')

var lezzgo = window.lezzgo = new Base({
  $val:200,
  $add:{
    $val:100,
    $add:a,
    $transform:function(val) {
      return val*2
    }
  }
})

log('?2')

log(lezzgo.$val)

var bla = new lezzgo.$Constructor({
  $add: {
    $val:1500
  }
})

log(bla.$val)

var x = new Base({
  a:'a',
  b:'b',
  c:'c',
  // $transform: function() {
  //   var obj = this.$convert()
  //   //make option in convert ignore function (e.g. ignore operators)
  //   //add each util
  //   // delete obj.$transform
  //   return obj
  // },
  $add: {
    x:true,
    hurk:true,
    c:'dddd'
  }
})

log( x.$val )

var xx = new x.$Constructor({
  $add: {
    d:'xxx'
  }
})

log('===xx====',xx.$val, '===orig====', xx.$add)

// log('?',xx.$val.$.on('$change', function() {

// }))

// vv2.youri = 'xxxxx'

// log(vv2.$toString())

// console.error('hatsa', vv.hatsa.$toString() )


// var x = new Base()

// // log( Object.keys( x.$flags) )

// // bla.$flags


// log( 'my own keys!', Object.keys( vv.$flags), vv.$flags.$val, vv.$flags.gurken, vv.$flags.xxx, bla.$flags.xxx )


