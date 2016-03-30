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
  , Value = require('../../../value')
  , resource = require('../../../browser/network/resource')
  , frame = require('../../../browser/animation/frame')
  , vObject = require('../../../object')
  , Base = require('../../../base')
  , User = require('../../../ui/user')
    .inject(
        require( '../../../ui/user/token' ) 
      , require( '../../../ui/user/multiscreen' ) 
    )
  , Data = require('../../../data')
  , cases = require('../../../browser/cases')


//hele tv gedoe
app.cloud = new Cloud( "ws://localhost:10001" )

app.region.val = 
{ transform: function( c, cv ) {
    var country = this.country_code && this.country_code.val
    return ( /DE|NL|CH|PL|RO|BE/.test( country ) && country ) //dit in $type? type definitions (e.g. has to be [ val, val, val ])
  }
, ajax:'http://play.mtvutt.com/geo'
//ff die default 
}

var Content = new Data( app.cloud.data.get('mtvData.NL.en') ) //dit nog aansluiten!

//doe al die default empty dingen ff op new of maak een special type ervoor
app.user = new User(
{ id: false //deze wil ik dat werkt !!! (qua inheritance)
, data: Content
, api:
  { auth: 'http://utt-staging.mtvnn.com/api/v1/users/'  
  }
, navigation:{}
, client:{}
, mainscreen:{}
, language: 
  { default: app.language
  }
, availableClients:{}
, cloud: app.cloud
})

cases.loggedin = new Value({ val: app.user.token, $convertType:'boolean' })

cases.connected = new Value(
{ val: app.user.mainscreen.client
, $convertType:'boolean'
}) 

cases.mainscreen = new Value(
{ val: app.user.mainscreen.client
//TODO: cv first is a lot better for operators e.g. transform: Math.floor
, transform: function( val, cv ) { 
    var client = this._parent._val.from
    //TODO: have to use 0 not being able to use false is quite lame!
    return ( client.key && client.key.val === app.user.cloud.clientid ) || 0
  }
, $convertType:'boolean'
}) 

cases.devicesPresent = new Value({
  val: app.user.availableClients
, transform: function( val, cv ) {
    if( !this._parent._val._val ) return 0
    return this._parent._val._val.length
  }
, $convertType:'boolean'
})

// cases.secondscreen = new Value({
  
// })

//-----------------------------------

cases.devicesPresent.on(function() {
  console.log('DEVICES PRESENT'.red.inverse, this.val )
})


cases.mainscreen.on(function() {
  console.log('MAINSCREEN'.red.inverse, this.val )
})

app.user.mainscreen.client.on(function() {
  console.log( 'client update'.magenta.inverse, this.from, this )
})

app.user.availableClients.on(function( val ) {
  if( this._val ) console.log( 'availableClients'.magenta.inverse, this._val.length, this.from, this )
})


//log word een flag --- zo smooth! godamn

app.region.on(function() {
  Content.val = app.cloud.data.get('mtvData.'+app.region.val+'.'+ app.user.language.val)
})

app.user.language.on(function() {
  Content.val = app.cloud.data.get('mtvData.'+app.region.val+'.'+ app.user.language.val)
})

app.initialised.update()

app.set(
{ lang:
  { node: 'button'
  , text: { val: 'lang:', add: app.user.language }
  , 'events.click': function() {
      app.user.language.from.val = app.user.language.val === 'en' ? 'de' : 'en'
    }
  }
, logout:
  { node: 'button'
  , text:
    { val: app.user.id //deze word niet goed gecopyed! -- mergh mergh
    , default: ' lezz try login again! '
    }
  , 'events.click': function() {
      var _this = this
      console.clear()
      _this.text.val = { transform: 'authenticating...' }
      app.user.token.once(function() {
        _this.text.val = { transform: false }
      })
      app.user.token = app.user.token.val ? false : 'by8uSopAv8qxCe6Wpbcd'
    }
  }
, myself: {
    text: 'myself: '
  }
, clients: 
  { node:'ul'
  , collection: {
      data: true
    , element: new Element({
        node:'li'
      , text:{ data: 'title', add:[ ' id: ', { data: 'key' } ] }
      , 'events.click': function() {
          console.log('set client'.magenta.inverse, this.data.from, app.user.mainscreen.client.userFrom)
          app.user.mainscreen.client.userFrom = this.data.from
        }
      })
    }
  , y: 20
  }
, connectedDiv: {
    node:'button'
  , text:{ val: 'CONNECTED: ', add: cases.connected }
  , 'events.click':function() {
      app.user.mainscreen.client.userFrom = false
    }
  }
, output: { html:'init....' }
})

app.output.node.style.color = 'grey'

//------ dit moet ff niet nodig zijn!!!----------
app.user.availableClients.on(function() {

  // alert('CLIENT!')
  if(!app.clients.data) {
    app.output.html = app.output.html.val += '\nset clients'

    this._val.on(function() {
      app.output.html = app.output.html.val += '\nupdate the selection for clients len:'+this.length
    })

    app.myself.text = { add: app.user.client.key }
    app.clients.data = this._val
  }
})

app.user.token = 'by8uSopAv8qxCe6Wpbcd'//'by8uSopAv8qxCe6Wpbcd'

