var Element = require('../../../browser/element').inject
    ( require('../../../browser/element/properties') )
  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/datacloud')
    , require('../../../browser/network/cloud/authenticate')
    , require('../../../browser/network/cloud/record')
    )
  , replace = require('../../../util/replace')

require('./style.less')
require('../../../browser/events') //required al basic

var uri = window.location.href.split('?')[1]
  , options = {}
  , p

if(uri) {
  uri = uri.split('&')
  while(p = uri.pop()) {
    p = p.split('=')
    options[p[0]] = p[1]
  }
}

window.o = options

var url = 'ws://'+(options.ws || 'localhost:10001')
console.log('connecting to ', url)

var f_mtvuser = 'rec_user_'+rnd()
  , f_hubuser = 'u_' + f_mtvuser
  , f_client = 'rec_client_'+rnd()

var cid = 'recordClient'
  , cloud = new Cloud(url, {VID: f_client})

window.c = cloud

cloud.data.addListener(function(){
  // console.log('cloudlistener!', cloud.data.raw)
  app.output.set(
    {text: JSON.stringify(cloud.data.raw, null, 2)}
  )
})

var button = new Element(
      { w: 100
      , h: 50
      , css: 'button'
      , t:{text: 'bottonlex'}
      }
    )
  , b1 = new button.Class({t:{text:'b1'}, events: {click: function(){
      console.log('b1!')
    }}})
  , b2 = new button.Class({t:{text:'b2'}, events: {click: function(){
      console.log('b2!')
    }}})
  , b3 = new button.Class({t:{text:'b3'}, events: {click: function(){
      console.log('b3!')
    }}})

var app = new Element(
  { node: document.body
  , bottons: { b1: b1, b2: b2, b3: b3 }
  , id: { text: 'id?', css:'output' }
  , output: {text: 'outputlol!' }
  }
)

cloud.on('welcome', function(msg){
  console.log('got dat welcome!', msg)
  app.id.set({text:msg})
})

function rnd(){
  return 'rnd_'+Number(String(Math.random()).slice(2)).toString(36)
}
// ============================================= 

b1.events.click.val = function(){console.log('wurk')}

var recording = window.r = require('./recording')

var subs = cloud.record.getSubs(recording.outgoing)
var repmap = {}

repmap['testuser0.17020135279744864'] = f_mtvuser
repmap['u_testuser0.17020135279744864'] = f_hubuser
repmap[recording.clientid] = f_client
// repmap[recording.otherclientid] = f_otherclient

replace(repmap, recording)

for(var f in subs){
  subs[f] = makeHash(JSON.stringify(subs[f]))
}

replace(subs, recording)

console.log('lurk', recording)

cloud.whenReady(function(){
  cloud.record.play(recording, {done:function(){
    console.log('recurdin duuuune')
    cloud.record.stop()
    var init = window.init = cloud.recordings.init
    console.log('played:\n', recording)
    console.log('new init recording:', init)
  }})
})
