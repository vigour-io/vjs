var Element = require('../../../browser/element').inject
    ( require('../../../browser/element/properties') )
  , Cloud = require('../../../browser/network/cloud').inject
    ( require('../../../browser/network/cloud/datacloud')
    , require('../../../browser/network/cloud/authenticate')
    )

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

var cloud = new Cloud(url)
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

var faved = false

var app = new Element(
  { node: document.body
  , bottons:
    { setrnd: new button.Class({t:{text:'rnd'}, events: {click: function(){

        console.log('setrnd!')
      }}})
    , setFav: new button.Class({t:{text:'favo'}, events: {click: function(){
        console.log('clicked it!')
        if(!faved){
          faved = true
          cloud.write({ set:
            [ [ 'users'
              , 'user_70b0dff98efd4ca4'
              , 'favos'
              , '195'
              ]
            , { '$t': 4
              , '$path':
                [ 'mtvData'
                , 'NL'
                , 'en'
                , 'shows'
                , '195' 
                ] 
              }
            , Date.now()
            ]
          })
        }else{
          faved = false
          cloud.write({ set:
            [ [ 'users'
              , 'user_70b0dff98efd4ca4'
              , 'favos'
              , '195'
              ]
            , null
            , Date.now()
            ]
          })
        }
      }}})
    , setTime: new button.Class({t:{text:'time'}, events: {click: function(){
        console.log('time update!')
        cloud.write({set:[
          [ 'users',
            'user_70b0dff98efd4ca4',
            'mtvData',
            'NL',
            'en',
            'shows',
            '195',
            'seasons',
            '0',
            'episodes',
            '0',
            'time' ]
        , Math.random()
        , Date.now()
        ]})
      }}})
    , setDate: new button.Class({t:{text:'startplay'}, events: {click: function(){
        console.log('startplay!')
        cloud.write({set:[
          [ 'users'
          , 'user_70b0dff98efd4ca4'
          , 'mtvData'
          , 'NL'
          , 'en'
          , 'shows'
          , '195'
          ]
        , { real:
            { '$path':
              [ 'mtvData'
              , 'NL'
              , 'en'
              , 'shows'
              , '195' 
              ]
            , '$t': 4 
            }
          , currentEpisode: 'mtvData.NL.en.shows.195.seasons.0.episodes.' + Math.floor(Math.random()*50)
          , date: 1414254418003 - Math.floor(Math.random()*99999)
          }
        ]})
      }}})
    , nothing: new button.Class({t:{text:'lurk'}, events: {click: function(){
        console.log('burk')
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
          //          R  l         s
          , mtvData: {$:{$:{shows:{$:{$:true, seasons:{$:{episodes:{$:{$:true}}}}}}}}}
          , favos:{$:{$:true}}
          }
        }
      }
      
    cloud.subscribe(subsobj)
  }else{
    
    var me = window.me = cloud.data.get(['clients', cloud.clientid], {})
      , ip = options.ip

    if(ip){
      if(ip === 'r')
        me.set('ip', rnd())
      else
        me.set('ip', ip)
    }

    var usersubs =  
    { key:true //generate ook in data
    , first_name:true
    , last_name:true
    , email:true
    , facebook_id:true
    , swipe:true
    , current:true
    , email:true
    , mainscreen:true
    , newsletter:true
    , purchases: { $:true } // '$'
    , mtvData:{ $:{ $:{ shows:{ $:{ currentEpisode:true } } } } } //'$.$.shows.$.currentEpisode'
    , role:true
    , userLang:true
    , trial_expires_at:true
    , activity: true
    , volume:true //wrong
    , clients: {$:{$:true}}
    }

    var authobj = {subs: usersubs} // {$:true, clients: {$:{$:true}}}

    if(options.tv)
      authobj.tv = true

    var token

    if(options.t){
      if(options.t === '2')
        token = usertoken2
      else if(options.t !== 'f')
        token = options.t
    }else{
      token = usertoken
    }

    console.log('ok token', token, 'from', options.t)
    authobj.token = options.t 
      ? options.t === '2' 
        ? usertoken2
        : options.t
      : usertoken

    authobj.url = 'http://utt-staging.mtvnn.com/api/v1/users/'

    cloud.authenticate
    ( authobj
    , function(res){
        console.log('yay authenticayshe', res)
      }
    )    
  }

  
})

function rnd(){
  return 'rnd_'+Number(String(Math.random()).slice(2)).toString(36)
}

// '8tKiGHDNcs7uRmAbjkvi'
// http://utt.mtvnn.com/api/v1/users/8tKiGHDNcs7uRmAbjkvi


