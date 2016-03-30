require('../style.less')

debug = require('../../../util/debug')


app = require('../../../ui/app')
      .inject( require( '../../../ui/app/values' ) )

app.node.style.overflow = 'scroll'

// app.url.val = { init: app.initialised } borken

var Element = require('../../../ui/element')

  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/rooms')
    , require('../../../browser/network/cloud/datacloud')
    , require('../../../browser/network/cloud/authenticate') //dit mischien lekker in user doen?
    // , require('../../../browser/network/cloud/debug')
    )
  , util = require('../../../util')
  , Value = require('../../../value').inject(
      // require('../../../object/localstorage')
    )
  , resource = require('../../../browser/network/resource')
  , pflag = require('../../../value/flags/process')
  , processx = require('../../../util/process')
  , frame = require('../../../browser/animation/frame')
  , vObject = require('../../../object')
  , Base = require('../../../base')
  , Data = require('../../../data')

app.cloud = new Cloud( "ws://localhost:10001" )

app.cloud.data.on(function( val ) {
  console.log(' ---xxxxxxx', val)
})

var REFERENCE = 'users.U_ba3215a1b1038a70.navigation.show'

var Ref

var Bla = new Value()

setTimeout(function() {
  console.clear()
  console.log('----------------')
  Ref = app.cloud.data.get(REFERENCE)

  Bla.val = Ref
},1000)


Bla.on(function() {
  console.log('REFREFREF', Bla._val._path.join('.'), ' ----> ', Ref.from._path.join('.'))
})

Element.base.extend({
  color:function(val) {
  this.node.style.color = val.val
  }
})

var a = {}
util.path(a,REFERENCE.split('.'),true)
// app.cloud.subscribe(a)





/*
 { url: caller.api.auth.val
        , subs: caller.subscriptions.raw
        , token: val
        //TODO: also add tv
        }
*/

app.cloud.authenticate( {
  url: 'http://utt-staging.mtvnn.com/api/v1/users/'  
, token: 'by8uSopAv8qxCe6Wpbcd'
, subs: {
    navigation: {
      show: true
    }
  }
}, function( res ) {



} )

app.set(
{ bla: 
  { header: { node:'h1', text:'Shows' }
  , collection: {
      data:'mtvData.NL.en.shows',
      element: new Element(
      { text: 
        { data:'title'
        , add: function() { 
            if(!this.data) return ''
            return ' id:'+this.data._name +' '
          } 
        }
      , 'w,h':75
      , mask:true
        , img: 
        { 'w,h':50
        , background: {
            data:'img',
            transform:function(val, cv) {
              if(!cv) return 
              return 'http://img.mtvutt.com/image/'+cv+'/50/50'
            }
          }
        }
      , 'x,y':10
      , color: {
          data:function() {
            // console.log('REF???????', Ref, this.data)
            if(this.data === Bla.from) {
              return 'blue'
            } 
            return 'black'
          },
          listen: Bla
        }
      , display:'inline-block'
      , events: 
        { click: function() {
            Bla._val.val = this.data
          }
        }
      })
    }
  }
, data: app.cloud.data
})
