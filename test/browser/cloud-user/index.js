var Element = require('../../../browser/element').inject
    ( require('../../../browser/element/properties') )
  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/datacloud')
    , require('../../../browser/network/cloud/authenticate')
    )

require('../../../util/debug')

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
  , hubs: {html: 'Hubs:<br>'}
  , output: {text: 'outputlol!' }
  }
)

cloud.on('welcome', function(msg){
  console.log('got dat welcome!', msg)
  app.id.set({text:msg})
  var hub = msg.split('@')[1]
  app.hubs.html.val = app.hubs.html.val + hub + '<br>'
})

// ============================================= 

var usertoken = '8tKiGHDNcs7uRmAbjkvi'
  , usertoken2 = 'by8uSopAv8qxCe6Wpbcd'

cloud.once('welcome', function(msg){
  console.log('lets go!')

  // cloud.subscribe({testlurf:true})


  if(options.subsonly){
    console.log('WEXT subsonly!!')
    var subsobj = 
      { users:
        { user_70b0dff98efd4ca4:
          { $:true
          , clients: {$:{$:true}}
          //          R  lang      show
          , mtvData: {$:{$:{shows:{$:{$:true, seasons:{$:{episodes:{$:{$:true}}}}}}}}}
          , favos:{$:{$:true}}
          }
        }
      }
      
    cloud.subscribe(subsobj)
  }else{
    
    var me = window.me = cloud.data.get(['clients', cloud.clientid], {})
      , ip = options.ip
      , wait = 0

    if(ip){
      if(ip === 'r')
        me.set('ip', rnd())
      else
        me.set('ip', ip)
      wait = 20
    }

    var usersubs =  
    { key:true //generate ook in data
    , clients: {$:{$:true}}
    , test:true
    , first_name: true
    , last_name:true
    }

    var authobj = {subs: usersubs} // {$:true, clients: {$:{$:true}}}

    if(options.tv)
      authobj.tv = true

    authobj.token = options.t 
      ? options.t === '2' 
        ? usertoken2
        : options.t === 'false'
          ? false
          : options.t
      : usertoken

    authobj.url = 'http://utt-staging.mtvnn.com/api/v1/users/'

    console.log('WAT', options.f)
    if(options.f)
      authobj.force = options.f

    setTimeout(function(){
      cloud.authenticate
        ( authobj
        , function(res){
            console.log('yay authenticayshe', res)
          }
        )    
    }, wait)
    
  }

  
})

function rnd(){
  return 'rnd_'+Number(String(Math.random()).slice(2)).toString(36)
}

var interval
window.updates = function(){
  if(interval)
    clearInterval(interval)
  else
    interval = setInterval(function(){
      var user
      cloud.data.users.each(function(){
        user = this
      })
      user.set('test', Math.random())
      
    }, 1e3)
}

// '8tKiGHDNcs7uRmAbjkvi'
// http://utt.mtvnn.com/api/v1/users/8tKiGHDNcs7uRmAbjkvi


