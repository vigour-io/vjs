require('../style.less')

// debug = require('../../../util/debug')

app = require('../../../ui/app')
      .inject( require( '../../../ui/app/values' ) )

app.node.style.overflow = 'scroll'

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
        require( '../../../ui/user/url' ) 
      , require( '../../../ui/user/token' ) 
      , require( '../../../ui/user/usage' ) 
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
{ id: false //deze wil ik dat werkt !!! (qua inheritance)z
// , favourites:{} //deze wil ik dat werkt !!! (qua inheritance)
, usage:{}
, data: Content
, api:
  { auth: 'http://utt-staging.mtvnn.com/api/v1/users/'  
  }
, navigation: 
  { page: { defer: true } //has to be truthy
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
      this.text.add.from.val = this.text.add.from.val === 'discover' ?  'shows' : 'discover'
    }
  }
, show: 
  { node:'button'
  , y:20
  , text:{ val:'show:', add:{ val: app.user.navigation.show, transform:function(c,cv){  return app.user.navigation.show.from._path.join('.')  } } }
  , 'events.click':function() {
      this.text.add.from.val = this.text.add.from.val === 'discover' ?  'shows' : 'discover'
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
console.log('!!!!!!!'.cyan.inverse, app.user.navigation.show._val ) 
app.set({
  showtje: 
  { title:{ text:{ data: 'real.title' } }
  , blurf: { text: { data: 'real.description', transform: function(c, val ) {  return val } } }
  , text:{data:'real.img',add:{data:'usage.time'}}
  , btn1: 
    { node:'button'
    , text:{ val:'settime:', add:{data:'usage.time'} }
    , 'events.click': function() {
        this.data.usage.get('time').val = Math.random()
      }
    }
  , btn2: 
    { node:'button'
    , text:{ val:'settime:', add:{data:'usage.time'} }
    , 'events.click': function() {
        this.data.usage.get('time').val = Math.random()
      }
    }

  // , ui: {

  // }
  // , btn1: 
  //   { node:'button'
  //   , text:'set blurf in usage data'
  //   , 'events.click': function() {
  //       app.user.usage.from.get( app.user.navigation.show.from._contentPath ).val = {
  //         blurf: Math.random()*99999
  //       }
  //     }
  //   }
  // , btn2: 
  //   { node:'button'
  //   , text: { val: 'toggle .favourite  --> ' }
  //   , 'events.click': function() {
  //       var usage = app.user.usage.from.get( app.user.navigation.show.from._contentPath )
  //       usage.val = {
  //         favourite: usage.get('favourite', false ).val ? false : true
  //       }
  //       this.text.update()
  //     }
  //   }
  // , btn3: 
  //   { node:'button'
  //   , text: { val: 'set watched  --> ' }
  //   , 'events.click': function() {
  //       var usage = app.user.usage.from.get( app.user.navigation.show.from._contentPath )
  //       usage.val = 
  //         { time: +new Date()
  //         , episode: app.user.navigation.episode.from
  //         }
  //     }
  //   }
  }
// , usage: {
//     // model: {
//     //   subscription: {
//     //     mtvData:{ NL: { de: { shows : { 195: { blurf:true } } }  } }
//     //   }
//     // } 
//     text: {
//       data: 'shows.195.blurf', add: '?????' //mtvData.NL.de.
//     }
//   , data: app.user.usage //zou chill zijn om hier ook gewoon al op languages te selecteren!
//     //check of dit allemaal goed update met in en uit loggen
//   }
// , favourites: {
//       y:20
//     , title: {text:'FAVOS!'}
//     , collection: {
//       data:true
//     , element: new Element({
//         title:{text:{data:'title', add:[' id:', {data:'id'}]}}
//       })
//     }
//   , data: app.user.favourites.from //zou ook zonder from moeten werken !!!
//   }
// , wacthed: {
//       y:20
//     , title: {text:'WATCHED!'}
//     , collection: {
//       data:true
//     , element: new Element({
//         title:{text:{data:'show.title', add:[' show id:', {data:'show.id'}, ' time:', {data:'time'}, ' episode:', {data:'episode.title'} ]}}
//       })
//     }
//   , data: app.user.watched.from //zou ook zonder from moeten werken !!!
//   }
//  , episode: {
//     data: {
//       epi: app.user.navigation.episode
//       // usage:
//     }
//   } 
})

app.user.navigation.show.on(function() {
  console.log('SELF!!!!!!!'.red.inverse, this._val)
  app.showtje.data = {
    real:this._val
  , usage:app.user.usage.userFrom.get( app.user.navigation.episode._val.from._contentPath )
  }
})

app.user.navigation.episode.on(function() {
  console.log('SELF!!!!!!!'.red.inverse, this._val)
  app.showtje.data = {
    real:app.user.navigation.show._val
  , usage:app.user.usage.userFrom.get( this.from._contentPath )
  }
})


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


