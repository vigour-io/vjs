require('../style.less')

var app = require('../../../ui/app')
  , Element = require('../../../ui/element')
  , util = require('../../../util')
  , debug = require('../../../util/debug')
  , Value = require('../../../value')
  , vObject = require('../../../object')

console.clear()

console.log('----------------------------')

bla = new Element({
  text:'bla!'
})

bla.extend({
  gurk:function() {
    console.log('gurk')
  },
  murder: {  //dit moet ff kunnene!
    new:function() {
      alert('new')
    }
  , render:function() {
      alert('render it')
    }
  , remove:function() {
      alert('remove!')
    }
  , parent:function() {
      alert('this is the parent!')
    }
  , set:function( val ) {
      this.node.style.border = val.val
    }
  }
})

elem = Element

x = new elem()

bla.set({
  murder:'1px solid blue'
})

app.add(bla)

console.log('----------------------------')

x.set({
  gurk: {
    text:'dit is gurk!'
  },
  boeloe:{
    text:'boel'
  }
})

app.add(x)

console.log('----------------------------')

bla.set({
  gurk: 20
})

console.log('----------------------------')

var nubleps = new bla.Class()

/*
  render  
  parent
  new
  remove
*/

// barf = function(){}
// util.define(
//   barf.prototype,
//   'ugh2',
//   false
// )

// bla = new barf()

// util.define(
//   bla,
//   'ugh',
//   false
// )


//maak idle 
//