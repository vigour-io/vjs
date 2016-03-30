
var app = require('../../../ui/app')
  , Element = require('../../../ui/element')
  , util = require('../../../util')
  , debug = require('../../../util/debug')
  , Value = require('../../../value')
  , vObject = require('../../../object')
  , Data = require('../../../data')
  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/rooms')
    , require('../../../browser/network/cloud/datacloud')
    , require('../../../browser/network/cloud/authenticate') //dit mischien lekker in user doen?
    , require('../../../browser/network/cloud/debug')
    )

app.cloud = new Cloud( "ws://localhost:10001" )
window.app = app

de = app.cloud.data.get('mtvData.NL.de.shows')
en = app.cloud.data.get('mtvData.NL.en.shows')

xx = new Data(
{ de_REF: de
, en_REF: en
})

app.scrollbar = 'y'

//value support in testobj

//model -- parent use model kan dingen adden aan data bijvoorbeeld

// -1 data moet werken met subscriptions voor nested dingen
// -2 value support

// -1 model fields kunnen laten adden

// TESTOBJ = new Element({
//   // text: { val: 'TESTOBJ', add: { data: '195.title' } }
//  gurk: {
//    collection:  
//     { data:'de_REF'
//     , element: new Element({
//         y:20,
//         text:{ data:'description', transform: function(v, cv) {  return cv.slice(0,50); } }
//       })
//     }
//   }

// , burk: {
//    y: 30
//    , collection:  
//     { data:'en_REF'
//     , element: new Element({
//         x:20,
//         y:20,
//         text:{ data:'description', transform: function(v, cv) {  return cv.slice(0,50); } }
//       })
//     }
//   }
// }).Class

TESTOBJ2 = new Element({
  title: {
    'text.data':'mflups.195.description'
  },
  gurk: {
    y:100,
    'text.data':'aflups.195.description'
  }
}).Class

// app.add( new TESTOBJ({ data: xx }) )

// yy = new Data({
//   mflups: en
// , aflups: de
// })

// TESTDATA = new Data( en, { subscription: { 195: { description: true } } })

//sort stuff! way harder ofcourse

app.add( new TESTOBJ({ 
  data: {
    de_REF: de
  , en_REF: en  
  } 
, 'events.click': function() {
    this.remove()
  }
}))

// app.add( new TESTOBJ({ 
//   data: {
//     de_REF: de
//   , en_REF: en  
//   } 
// , 'events.click': function() {
//     this.remove()
//   }
// }))

//nu nog met Values en Model
//ook voor filter!
//test meteen sort etc
//check voor parent


