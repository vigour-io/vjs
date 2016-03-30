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
        // require( '../../../ui/user/url' ) 
       require( '../../../ui/user/token' ) 
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

app.user = new User(
{ id: false //deze wil ik dat werkt !!! (qua inheritance)
, data: Content
, api:
  { auth: 'http://utt-staging.mtvnn.com/api/v1/users/'  
  }
, navigation: 
  { }
, language: 
  { default: app.language
  // , force:true
  }
, cloud: app.cloud
// , url: app.url
// , model: {
//     language: app.language //fix dit!
//   }
// , token: 'by8uSopAv8qxCe6Wpbcd'
})

cases.loggedin = new Value({ val: app.user.token, $convertType:'boolean' })

app.set(
{ text:'not loggyerdilogged'
, loggedin: {
   text:'HOLY MOLY loggedin!'
  }
})

//dit ff nice meenemen in user!
app.region.on(function() {
  Content.val = app.cloud.data.get('mtvData.'+app.region.val+'.'+ app.user.language.val)
})

app.user.language.on(function() {
  Content.val = app.cloud.data.get('mtvData.'+app.region.val+'.'+ app.user.language.val)
})

//switch tussen real userdata en fake
// app.user.token = 'by8uSopAv8qxCe6Wpbcd'
//url 
// app.url.params.on(function() {
//   // if(this.m)
//   // if(this.f)
//   // if(this.r) zoek apple app links uit
//   console.log('PARAMS UPDACE!!!!')
// })


// app.state.on(function( val ) {
//   alert(val)
// })

app.initialised.update()
//mischien values ook extensions maken -- is wel geinig

// setTimeout(function() {
//   alert('setting smurf!')
//   app.state.val = 'smurf'
//   // app.initialised.update()
// },1000)


xx = Element

console.error( app.user.id , Element, app.state.val )

Element.base.extend({color:function(val) {
  this.node.style.color = val.val
}})

app.set(
{ current:
  {
    text: app.user.navigation.page
  }
, outputs: {
    html:''
  }
, lang:
  { node: 'button'
  , text: { val: 'lang:', add: app.user.language }
  , 'events.click': function() {

      // var r = Math.random()

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
      //deze gaat nog mis -- app.user.id word geset -- deze word niet geupdate!
      // app.user.id (original)  -----> new ---->  logout.text ---> app.user.id
      app.user.token.once(function() {
        _this.text.val = { transform: false }
      })
      app.user.token = app.user.token.val ? false : 'by8uSopAv8qxCe6Wpbcd'
    }
  }
, urlx:
  { node: 'button'
  , text:
    { val: 'url params!: ' }
  , 'events.click': function() {
      app.url.val = app.url.val+'?blurfi'
    }
  }
  , output : {
    text:
    { listen: [ app.user.navigation.show, app.user.navigation.page, app.user.navigation.episode ] 
    , val: function( val ) {
        // console.log('??????')
        return JSON.stringify( app.user.navigation.raw, false, 2 )
      }
    }
  , h: 200
  , w: app.w
  , scrollbar:true 
  }
, bla: 
  { header: { node:'h1', text:'Shows' }
  , collection: {
      data:'shows',
      element: new Element(
      { text: 
        { data:'title'
        , add: function() { 
            if(!this.data) return ''
            return ' id:'+this.data._name +' '
          } 
        }
      , bla: {
          text:{ data: 'description', transform:function(c, cv) {
              return cv.slice(0,10)
          } }
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
          //all updates on data! since it has data as a property!
          data:function() {
            //alleen op self!

            if(this.data === app.user.navigation.show.from) {
              this.rotate = Math.random()*360
              // alert('COLOR UPDATE!')
              return 'blue'
            } 
            return 'black'
          },
          listen: app.user.navigation.show
        }
      , display:'inline-block'
      , events: 
        { click: function() {
            // console.clear()
            console.log('STEP ONE', app.user.navigation.show._val, this.data)
            app.user.navigation.show.userFrom = this.data
          }
        }
      })
    }
  }
, blax: 
  { header: { node:'h1', text:'Episodes -- Show' }
  , on: {
      val: app.user.navigation.show,
      defer:function( update, args ) {
        console.log( 'update .on --- argument val', args )
        //dit moet straks kunnen met data! (dat ie ook switched etc)
        this._caller.data = app.user.navigation.show.from.get('seasons.0.episodes')
        update()
      }
    }
  , collection: {

       data:true,
      element: new Element(
      { text: 
        { data:'title'
        , add: function() { 
            if(!this.data) return ''
            return ' id:'+this.data._name +' '
          } 
        }
      , 'w,h':50
      , mask:true
      , img: 
        { 'w,h':50
        , display:'inline-block'
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
          data:function(val) {

            if(this.data === app.user.navigation.episode.from) {
              // alert('COLOR UPDATE!')
              return 'blue'
            } 
            return 'black'
          },
          listen: app.user.navigation.episode
        }
      , display:'inline-block'
      , events: 
        { click: function() {

            app.user.navigation.episode.userFrom = this.data
          }
        }
      })
    }
  }
, data: Content

//----------------
// , main: new Main.Class(
//   // { page: app.user.navigation.page
//   { on:
//     { page: app.user.navigation.page
//     , episode: app.user.navigation.episode
//     , share: app.share
//     }
//   })

})

//moet nog aangesloten worden op init -- werkt alleen als deze update word gecalled!
// app.user.navigation.page.update() //bug moet geresolved worden! met init op alles

app.user.navigation.show.on( function( val ) {
  //val
  console.log( '\n\n\n\n\n\n\n\ndo it--->'.yellow.inverse, this.val, val )
})

// setTimeout(function() {
// app.url.update()
app.user.token = 'by8uSopAv8qxCe6Wpbcd'//'by8uSopAv8qxCe6Wpbcd'
// },200);

// app.user.id = '!@#!@#!@#!@#!@#!@#'
app.user.navigation.show.on(function() {
  app.outputs.html = app.outputs.html.val+'\n SHOW'
})
