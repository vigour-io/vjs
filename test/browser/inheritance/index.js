require('../style.less')
var debug = require('../../../util/debug')

var app = require('../../../ui/app')
  , Element = require('../../../ui/element')
  , util = require('../../../util')
  , Value = require('../../../value')
  , vObject = require('../../../object')

// console.clear()

/*
  lastige case

  instances a,b,c

  f.y ---> b.x

    instance
      z

  change z.y ---> make sure that its bound to instance z! --- very hard to do

  maybe ignore this case for now?

*/

console.log('----------------------------')

bla = new Element({
  x: 200
, text:'bla!'

, y :10
, background: {
    mux: true,
    meps:false
  }
, events: {
    click: function() {
      console.log('----------------------------')
      console.log('---> change x')
      this.x = Math.random()*999 | 0
      this.background.mux.val = Math.random()*999 | 0
    }
  }
})

bla.x.addListener([ function() {
  console.log('x ---> text',  this.node )
}, bla ], true )
//now the hardest changing text to change listener

// bla.x.addListener([ function() {
//   console.log('x ---> text -- base as mark',  this.node )
// }, bla ], true ) //this should inherit

bla.x
  .on(
    function() {
      console.log('ON test ---> x ---> text -- base as mark',  this.node )
    }, 
    bla
  )

// bla.x.addListener([ function() {
//   console.log('x ---> text -- text as mark',  this.node ) //deze moet ook veranderen als text veranderd?
// }, bla.text ], true ) //this should inherit

//only when you add a mark!
bla.x.addListener( function() {
  console.log('x ---> should not inherit!',  this._caller.node || this._base )
})

bla.background.mux.addListener([
  function() {
    console.log('fo my dogs'.cyan, this.node)
  },
  bla
], true) 
//second arg als je geen method geeft gebruik het dan als mark (rewrite naar array , of doe dit op on!)

elem = Element

app.add(bla)

console.log('----------- NOW IM MAKING NEW ------------')

app.add( new bla.Class({
  y:20,
  background:{
    meps:20
  },
  // x:20,
  text:{ add:' --- this is now my own text' }
}))

console.log('----------------------------')



//---nested
//---direct values
//---mark listeners
//    --- mark can be object or value/prop


//----------NESTED FIELDS!-------------
