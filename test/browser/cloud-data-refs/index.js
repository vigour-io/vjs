var Element = require('../../../browser/element').inject
    ( require('../../../browser/element/properties') )
  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/datacloud')
    , require('../../../browser/network/cloud/authenticate')
    )

require('./style.less')
require('../../../browser/events') //required al basic
require('../../../util/debug')

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
  , params = options.ip ? {ip:options.ip} : false
  , cloud = new Cloud(url, params)
  
console.log('connecting to ', url)

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

var app = new Element(
  { node: document.body
  , bottons:
    { setrnd: new button.Class({t:{text:'rnd'}, events: {click: function(){
        console.log('setrnd!')
      }}})
    }
  , id: { text: 'id?', css:'output' }
  , output: {text: 'outputlol!' }
  }
)

cloud.on('welcome', function(msg){
  console.log('got dat welcome!', msg)
  app.id.set({text:msg})
})

// ============================================= 

cloud.once('welcome', function(msg){
  console.log('lets go!')

  // cloud.subscribe({testlurf:true})

  cloud.subscribe({test:{ref:{$:true}, obj1:{field:true}, obj2:{field:true}}})



  // cloud.subscribe({test:{ref:{$:true}}}) // , obj1:{$:true}, obj2:{$:true}
  // cloud.subscribe({test:{obj1:{$:true}}})
  // cloud.subscribe({test:{obj2:{$:true}}})

})

// cloud.data.set('test', {})
var test = window.test = cloud.data.get(['test'], {})

window.doTest = function(){

  test = window.test = cloud.data.get(['test'], {})
  test.val = {
    obj1: {field: 111111, o1other:1},
    obj2: {field: 222222, o2other:2}
  }
}



function rnd(){
  return 'rnd_'+Number(String(Math.random()).slice(2)).toString(36)
}

// '8tKiGHDNcs7uRmAbjkvi'
// http://utt.mtvnn.com/api/v1/users/8tKiGHDNcs7uRmAbjkvi


