require('../style.less')

var app = require('../../../ui/app')
  , Element = require('../../../ui/element')
  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/rooms')
    , require('../../../browser/network/cloud/datacloud')
    , require('../../../browser/network/cloud/debug')
    )
  , util = require('../../../util')
  , debug = require('../../../util/debug')
  , Value = require('../../../value')
  , resource = require('../../../browser/network/resource')
  , pflag = require('../../../value/flags/process')
  , processx = require('../../../util/process')
  , frame = require('../../../browser/animation/frame')
  , cloud = new Cloud("ws://54.171.153.51:80")
  , vObject = require('../../../object')

processx.raf = frame
processx.burk = new vObject()
processx.barf = new vObject()
processx.blubber = new vObject()

// processx.burk.addListener(function() {
//   processx.once(blarf, function() {
//     processx.combi.update()
//   })
// })

processx.combi = new Value({process:'raf'})
//ook done adden

resource(
  [ 'http://play.mtvutt.com/bundle.css'
  // , 'http://play.mtvutt.com/bundle.js'
  ]
  , function() {
    // alert('loaded!')
  }
)

var aCollection = new Element({
  model:{ ios: { process: 'blurfi' } },
  flipperdieflap:
    { node:'h1'
    , text:{
      val:function(c ) {
        console.log('---> ??', arguments)
        return ' ---> '+Math.random()*9999
      }
    , add:{ data:'mtvData.NL.en.shows.195.title' }
    , process:'blubber'
    }
  } ,
  collection: {
    data:'mtvData.NL.en.shows' ,  //do gets if cloud
    element:new Element({
      text:{ data:'title' },
      display:'inline-block',
      w:200,
      h:200,
      background:
      { val:'http://img.mtvutt.com/image/'
      , add:[ { data:'img' }, '/200/200' ]
      , process:'blubber'
      }
    }),
    process:'barf'
  }
}).Class
// console.clear()

app.add((aa = new aCollection()))


console.log('------MAKE------'.magenta.inverse)


var burpe = new Element({
  text:{val:'BLURF'},
  // events: {
  //   click:function() {
  //     this.text.val = Math.random()*999
  //   }
  // }
})

app.add(burpe)

console.log('------MAKE2------'.magenta.inverse)


var burp = new Element({
  text:{val:'BLURF2', process:'burk'},
  // events: {
  //   click:function() {
  //     this.text.val = Math.random()*999
  //   }
  // }
})

app.add(burp)

app.data = cloud.data


//debug
p = processx
c = cloud
a = burp

console.log('------scripz------'.magenta.inverse)
// debugger

setTimeout(function() { p.burk._update() }, 1500)
setTimeout(function() { p.barf._update() }, 3000)
//dit zou ook kunnen op all images complete inpv hoe het nu is
setTimeout(function() { p.blubber._update() }, 6500)


processx.blubber.once(function(val) {
  console.log('ONCE --- blubber', this.val)
})

//subscripe moet gefixed worden voor adds!