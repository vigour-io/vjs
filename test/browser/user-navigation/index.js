require('../style.less')

// debug = require('../../../util/debug')

app = require('../../../ui/app')
      .inject( require( '../../../ui/app/values' ) )

app.node.style.overflow = 'scroll'


//users --- localstorage --- uitstel if token!


var Element = require('../../../ui/element')

  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/rooms')
    , require('../../../browser/network/cloud/datacloud')
    , require('../../../browser/network/cloud/authenticate') //dit mischien lekker in user doen?
    , require('../../../browser/network/cloud/debug')
    )
  , util = require('../../../util')
  , Value = require('../../../value')
  , resource = require('../../../browser/network/resource')
  , frame = require('../../../browser/animation/frame')
  , vObject = require('../../../object')
  , Base = require('../../../base')
  , User = require('../../../ui/user')
    .inject(
        // require( '../../../ui/user/url' ) 
       require( '../../../ui/user/token' ) 
      // , require( '../../../ui/user/usage' ) 
    )
  , Data = require('../../../data')
  , cases = require('../../../browser/cases')

app.cloud = new Cloud( "ws://localhost:10001" )

app.region.val = 
{ transform: function( c, cv ) {
    var country = this.country_code && this.country_code.val
    return ( /DE|NL|CH|PL|RO|BE/.test( country ) && country ) //dit in $type? type definitions (e.g. has to be [ val, val, val ])
  }
, ajax:'http://play.mtvutt.com/geo'
}

var Content = new Data( app.cloud.data.get('mtvData.NL.en') ) //dit nog aansluiten!

app.user = new User(
{ id: false //deze wil ik dat werkt !!! (qua inheritance)
// , favourites:{} //deze wil ik dat werkt !!! (qua inheritance)
, usage:{}
, data: Content
, api:
  { auth: 'http://utt-staging.mtvnn.com/api/v1/users/'  
  }
, navigation: 
  { page:{} //has to be truthy
  , episode:{}
  , show:{}
  }
, language: { default: app.language }
, cloud: app.cloud
, url: app.url
, token: 'by8uSopAv8qxCe6Wpbcd'
})

cases.loggedin = new Value({ 
  val: app.user.token
, $convertType:'boolean' 
})

app.region.on(function() {
  Content.val = app.cloud.data.get('mtvData.'+app.region.val+'.'+ app.user.language.val)
})

app.user.language.on(function() {
  Content.val = app.cloud.data.get('mtvData.'+app.region.val+'.'+ app.user.language.val)
})

app.initialised.val = true

app.set({
  logout:
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
      app.user.token =  !app.user.token.val 
        ? 'by8uSopAv8qxCe6Wpbcd' 
        :  app.user.token.val === 'by8uSopAv8qxCe6Wpbcd' 
           ?  'dksCBacs8xsUpNqzRdw6' 
           : false
    }
  }
, lang:
  { node: 'button'
  , text: { val: 'lang:', add: app.user.language }
  , 'events.click': function() {
      app.user.language.from.val = app.user.language.val === 'en' ? 'de' : 'en'
    }
  }
, page: 
  { node:'button'
  , y:20
  , text:{ val:'page:', add: app.user.navigation.page }
  , 'events.click':function() {
      console.log('USER FROM PAGE!')
      this.text.add.userFrom = this.text.add.from.val === 'discover' ?  'shows' : 'discover'
    }
  }
, page2: 
  { node:'button'
  , y:20
  , text:{ val:'change page to discover' }
  , 'events.click':function() {
      app.user.navigation.page.userFrom = 'discover'
      // app.user.navigation.page.update()
    }
  }

, page3: 
  { node:'button'
  , y:20
  , text:{ val:'change show to 195' }
  , 'events.click':function() {
      app.user.navigation.show.userFrom = app.user.data.get('shows.195')
      // app.user.navigation.page.update()
    }
  }

, page4: 
  { node:'button'
  , y:20
  , text:{ val:'change episode to 1271/0/6' }
  , 'events.click':function() {
      app.user.navigation.episode.userFrom = app.user.data.get(["shows", "1271", "seasons", "0", "episodes", "6"])
      // app.user.navigation.page.update()
    }
  }

})

//--------------------------------------------------

// app.set({
//   showtje: {
//     text: { data: 'description', transform: function(c, val ) {  return val } } ,
//     data: app.user.navigation.show
//   }
// })

app.cloud.subscribe({
  mtvData: {
    NL: {
      en: {$:{$:{$:{$:true}}}}
    }
  }
})

var user = app.user

app.set({
  blurf: {
    html: {
      // _skip:true,
      force:true,
      val: user.navigation,
      listen:[ user.navigation.episode, user.navigation.show, user.navigation.page, user.navigation.show, user.navigation.last ],
      transform: function() {
        // console.log( 'HERE!', app.user.navigation.raw, 'JSON', JSON.stringify(app.user.navigation.raw, false, 2) )
        return JSON.stringify( app.user.navigation.raw, false, 2)
      }
    }
  },
  last: {
    html: '?'
  },
  myblurf: {
    y:20,
    html: '------a'
  }
})

app.myblurf.node.style.border = '1px solid blue'

app.user.navigation.show.on(function() {
  console.log('\n\n\nget show')
  app.myblurf.html.val = app.myblurf.html.val + '\nSHOW!!!!!'+Math.random()*9999999
})

app.user.navigation.episode.on(function() {
  console.log('\n\n\nget episode')
  app.myblurf.html.val = app.myblurf.html.val + '\nEPISODE!!!!!'+Math.random()*9999999
})

// app.user.navigation.show.from.on(function() {
//   console.log('\n\n\nget show from')
//   app.myblurf.text.val = 'SHOW --- FROM!!!!!'+Math.random()*9999999
// })

app.user.navigation.page.on(function() {
  console.log('\n\n\nget page')
  app.myblurf.html.val =  app.myblurf.html.val + '\nPAGE!!!!!'+Math.random()*9999999
})

app.user.navigation.last.on(function() {
  app.last.html.val = JSON.stringify( this.from.raw, false, 2 )
})


/*
  episode
  show
  navigation

*/

/*
  favorites , shows you watched
*/


/*
  teasers , terms, channels
*/

/*
data: {
  real: epiRef  
, usage: app.user.usage.from.get( app.user.navigation.show.from._contentPath )
}
*/


