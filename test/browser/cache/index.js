require('../style.less')

debug = require('../../../util/debug')


app = require('../../../ui/app')
     

// app.url.val = { init: app.initialised } borken

var Element = require('../../../ui/element')

  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/rooms')
    , require('../../../browser/network/cloud/datacloud')
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
  , User = require('../../../ui/user')
  , Data = require('../../../data')

app.cloud = new Cloud( "ws://54.171.153.51:80" )

var Content = new Data( app.cloud.data.mtvData )

console.clear()

app.inject( require( '../../../ui/app/values' ) )
app.inject( require( '../../../ui/app/values' ) )

var a = {}

a.extend = util.extend( function( xxx ) {
 	console.log('blurf blurf'.cyan.inverse)
})

//gebruik extensions nu ook voor extend

var b = new Element()
b.inject(a)
b.inject(a)

b.extend({

	BLUF: function() {
		console.log('xxxx!!!!!!'.green.inverse)
	}

})

b.BLUF = 'yuzzzzi'

console.log(b)

var g = new b.Class()

g.extend({
	BLUF: function() {
		console.log('yuzi'.green.inverse)
	}
})

g.BLUF = 'xxxx22'

var x = new g.Class()

g.BLUF = 'YOURIWWW' //(3x yuzi 1x xxx)

// app.set({
//   region: 
//     { transform: function( c, cv ) {
//         var country = this.country_code && this.country_code.val
//         console.log(cv, country)
//         return ( /DE|NL|CH|PL|RO|BE/.test( country ) && country )
//       }
//     , ajax:'http://play.mtvutt.com/geo'
//         // , default: 'DE' //mischien niet operator maar flag? --- iig na transform doen

//     // , type:'string'
//     // , localstorage:'region' //fix dit! is nog beetje kapot condition beter managen
//     }
// })

// console.log('@!#!@#!@#', app.region, app.url )

// //add inheritsAllListener op base property vanuit value
// app.user = new User(
// { data: Content
// , cloud: app.cloud
// , navigation: 
//   { page: { val: 'a', defer: true }
//   }
// , url: app.url
// })

// app.url.params.on(function() {

//   console.log('PARAMS UPDACE!!!!')


// })

// var hostori = new Value({ val:'yuxi', nocache:true })

// hostori.on(function() {
//   console.log('xxx'.inverse.red)
// })

// hostori.val = 'xxxxxx'

// hostori.val = 'xxxxxx'

// hostori.val = 'xxxxxx'

// hostori.val = 'xxxxxx'



// // setTimeout(function() {
// //   hostori.val = '21213123'
// // },10)


// app.user.token = 'yuz'

// app.region
//   .on( function() {
//     console.log('REGION!'.inverse, this.val)
//   })
//   .on('NL', function() {
//    console.log('HUP HOLLAND!'.inverse, this.val)
//   })

// app.initialised.update()

// var Switcher = new Element()
// Switcher.extend
// (
//   {
//     transition: function( val ) {
//       //val --- dit zou dan de value zijn waar die op listened
//       //is dit hoe we transistion willen?
//       val = val.val
//       var _this
//       if( val instanceof Element )
//       {
//         console.log(' add to transition ')
//         this.empty()
//         //this.animaceLogix
//         val.x = { val: 360, animation: { start: 1, time: 20 }}
//         _this = this
//         setTimeout(function() {
//           _this.add( val )
//         },100)
//       }
//       else
//       {
//         console.error( 'Switcher.transistion --> val is not an element', val )
//       }
//     }
//   }
// )

// var Main = new Switcher.Class(
// { on:
//   { $new:
//     { defer: function() {
//         console.log('NEW  INSTANCE!')
//       }
//     }
//   , page:
//     { defer: function( update ) {
//         console.log('DEFER DEFER DEFER -----????????')
//         this._parent._caller.transition = new Element({ text: 'funny', on: this })
//         update()
//       }
//     }
//   , phone: {
//       episode:
//       { defer: function( update ) {
//            this._parent._caller.transition = new Episode(
//           { on:
//             { val: this
//             , share: this._parent.share
//             }
//           })
//           update()
//         }
//       }
//     }
//   , $remove: {
//       defer:function() {
//         console.log('REMOVE!')
//         return true
//       }
//     }
//   }
// })

// DEBUG$.app = app

// // Main.extend({
// //   // page:function() {

// //   // }
// // })
// // User.role.on('trial', function)
// // Main.page.on(fun)
// // Main.transition = Main.on.page
// //set op normaal base (als niet gedefined ) maak een nieuwe property als value maybe

// app.set(
// { current:
//   {
//     text: app.user.navigation.page
//   }
// , btn:
//   { node: 'button'
//   , text:
//     { val: 'set: '
//     , add:
//       { val: app.user.navigation.page
//       , transform: function( val, cv ) {
//           return cv==='a' ? 'b' : 'a'
//         }
//       }
//     }
//   , 'events.click': function() {
//       app.user.navigation.page.from = this.text.add.val
//     }
//   }
// , btnRemove:
//   { node: 'button'
//   , text:
//     { val: 'remove: ' }
//   , 'events.click': function() {
//       this.parent.main.remove()
//     }
//   }

// //----------------
// , main: new Main.Class(
//   // { page: app.user.navigation.page
//   { on:
//     { page: app.user.navigation.page
//     , episode: app.user.navigation.episode
//     , share: app.share
//     }
//   })

// })

// app.user.navigation.page.update() //bug moet geresolved worden!



