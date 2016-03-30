require('../style.less')

var app = require('../../../ui/app')
  , Element = require('../../../ui/element')
  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/rooms')
    , require('../../../browser/network/cloud/datacloud')
    // , require('../../../browser/network/cloud/debug')
    )
  , util = require('../../../util')
  , debug = require('../../../util/debug')
  , Value = require('../../../value')
  , resource = require('../../../browser/network/resource')
  , pflag = require('../../../value/flags/process')
  , processx = require('../../../util/process')
  , frame = require('../../../browser/animation/frame')
  , cloud = c = new Cloud("ws://54.171.153.51:80")
  , vObject = require('../../../object')
  , Data = require('../../../data').inject(require('../../../data/selection'))
  , ua = require('../../../browser/ua')
  , events = e = require('../../../browser/events/windowFocus')

var defer = require('../../../value/flags/process') //rename

var mups = new Value()

bla = new Value(
{ val: 'argh'
, defer: function( method ) { //handle own vObject pefect for inheritance! get .val --
    if(Math.random()*10>9) {
      setTimeout( method, 0 )
    } else {
      return true
    }
    // if() {
    // return true
    // }

}
// , init: mups //moet samen met defer kunnen -- maak een functie voor alle 2 -- [ string ('defer') ()'init']
// , init: //fn , or value or maybe on new??? -- only first time pretty smooths
})

bla.on( 'smups', function() {
console.log( ' ------ go go go smups'.inverse )
})
.on( 'remove', function() {
console.log('REMUX!')
})
.on( 'added', function() { //added werkt nooit...
console.log('ADD!')
})

/*

    fix dit!

*/


bla.val = 'smups'

bla.set('bla', 111)

console.log(bla.val)


setTimeout( function g() {
  // mups.update()
  // bla.val = 'x'
  console.log('------'.red, bla.val)
  bla.update()

  //forcing update does not work as expected!

  // bla.val = Math.random()*9999
  // console.log(bla.val)
  setTimeout( g, 100 )

}, 100 )




// bla.remove()

/*
  process as function defers updates
  //mayeb call it defer? extra wrapper around update then you can combine it with process as well


  //init -- process but only once

*/




