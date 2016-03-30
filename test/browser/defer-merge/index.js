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
  , Data = require('../../../data') //.inject( require('../../../data/debug') )

app.cloud = new Cloud( "ws://localhost:10001" )

app.showData = app.cloud.data.get('mtvData.NL.en.shows.195')

app.testValue = app.cloud.data.get('users.U_ba3215a1b1038a70.navigation.show') //new Data()

var ep = 0

// lang:en U_ba3215a1b1038a70

app.set({
  btn: {
    node:'button'
  , text:'change datax'
  , 'events.click':function() {
      console.log('change data'.cyan.inverse)
      app.output.html = app.output.html.val+='\n\n\n ------EPISODE-------'
      console.clear()

      // app.testValue.val = app.cloud.data.get('mtvData.NL.en.shows.977')
      ep++
      app.add( new Element(
      { text:{ data: 'img' }
      , x:100
      , data: app.testValue.from.get('seasons.1.episodes.'+ep)
      }) )

    }
  },
  btn2: {
    node:'button'
  , text:'change datax show'
  , 'events.click':function() {
      console.log('change data'.cyan.inverse)
      app.output.html = app.output.html.val+='\n\n\n -------SHOW-------'
      console.clear()
      app.testValue._val.val = app.cloud.data.get('mtvData.NL.en.shows.977')
    }
  },
  output: {
    html:'------init-------'
  }
})

app.testValue.on(function() {
  app.output.html = app.output.html.val+='\nTEST VALUE!'
  console.log('test value'.cyan.inverse , arguments )
})

app.first = new Value(true)

app.defered = new Value({
  val: app.testValue,
  defer:function(update, args) {
    this.clearCache()
    app.output.html = app.output.html.val+'\n --TROUGH DEFERED ' +app.first.val

    console.log('TROUGH DEFER!'.red.inverse, args, app.first )
    if(app.first.val) {
       console.log('UPDATE!')
        app.output.html = app.output.html.val+'\nupdate!!!'
      update()
    } else {
      console.log('NO UPDATE!')
       app.output.html = app.output.html.val+'\n --NO UPDATE'
      return true
    }
  }
})

app.cloud.data.on(function(val, stamp, from) {
  try {
    app.output.html = app.output.html.val+='\n-----> cData '+stamp+' from:'+JSON.stringify(val)+'\n'
  } catch(e){}
})

app.defered.on(function() {
  console.log('\n\n\n app.DEFERED UPDATE'.magenta.inverse, arguments )
  app.output.html = app.output.html.val+='\nDEFERED'
})

app.bla = new Value({def:app.defered})

app.bla.on(function() {
  app.output.html = app.output.html.val+='\nbla'
})

console.clear()

var testElem = new Element(
{  text:{ data: 'def.title', defer:function(u) {

  app.output.html = app.output.html.val+'\nTEXT UPDATE'
  u()

} } 
, data: app.bla
})

app.add( testElem )

app.testValue.val = app.showData

// alert('FALSE')
app.first.val = false
// var bla = new 