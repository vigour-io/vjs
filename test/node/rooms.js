var Cloud = require('../../browser/network/cloud').inject
    ( require('../../browser/network/cloud/datacloud') 
    , require('../../browser/network/cloud/rooms')
    )
  , repl = require('repl')

var context = repl.start({ prompt: '> ', useGlobal: true }).context
  , cloud = context.c = new Cloud('ws://localhost:7777')
  
cloud.on('error', function(err){
  console.log('error!', err)
})
cloud.on('reconnect', function(err){
  console.log('reconnect')
})
cloud.on('welcome', function(err){
  console.log('welcome!')
})

context.j = function(){
  cloud.join(
    { type: 'test'
    , name: 'testroom1'
    }
  )  
}

context.j2 = function(){
  cloud.join(
    { type: 'test'
    , name: 'testroom2'
    }
  )  
}

context.w = function(){
  cloud.join(
    { type: 'test'
    , wait: true
    }
  )
}


cloud.on('join', function(msg){
  console.log('joined room!\n', msg)
})

cloud.data.addListener(function(val) {
  console.log('basic listener', val)
})