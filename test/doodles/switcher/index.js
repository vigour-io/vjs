require('./style.less')

var app = require('../../../ui/app')
  , Element = require('../../../ui/element')
  , Switcher = require('../../../ui/switcher')
  , User = require('../../../ui/user')
  , Data = require('vigour-js/data')
  , Value = require('vigour-js/value')
  , nav = (app.user = new User()).navigation

// app.user = new User()

//------------------ app module pageswitcher level

function switchPage( pageString, data ){
  var parent = this._parent
    , caller = parent._caller
    , direction
    , last = parent.last

  //logic here
  var topItems = ['discover','shows','channels']
    , _toTop = ~topItems.indexOf(pageString)
    , _fromTop = ~topItems.indexOf(last)
    , fromTop = (_fromTop && !_toTop)
    , toTop = (last && _toTop && !_fromTop)
    , showToEpisode = pageString === 'episode' && last === 'show'
    , episodeToShow = pageString === 'show' && last === 'episode'

  if(fromTop || showToEpisode)
  {
    direction = 1//next
  }
  else if(toTop || episodeToShow)
  {
    direction = -1//prev
  }

  parent.last = pageString

  //set transition
  caller.transition = 
  { val:new MainSwitcherPage
    ( { text:data ? JSON.stringify(data,false,2) : pageString
      , h:Math.random()*400+300
      }
    )
  , direction:direction
  }
}

var MainSwitcher = new Switcher
( { on:
    { page: //discover, shows, channels
      { defer: function( update ) {
          var page = this.from.val
          console.log('PAGE!',page,this)
          switchPage.call(this,page)
          update()
        }
      }
    , show:
      { defer: function( update ){ // combine these function in one factory function
          var page = 'show'
          console.log('SHOW!',this.from.val)
          switchPage.call(this,page,this.from.val)
          update()
        }
      }
    , episode:
      { defer: function( update ){
          var page = 'episode'
          console.log('episode!',this.from.val)
          switchPage.call(this,page,this.from.val)
          update()
        }
      }
    , channel:
      { defer: function( update ){
          var page = 'channel'
          switchPage.call(this,page,this.from.val)
          update()
        }
      }
    }
  , init:function( current, last, direction ){
      var _this = this
      function done(){
        if(last) last.remove()
      }
      if(direction === -1)
      {
        current.x = 
        { animation:
          { start:-100
          , time:18
          , done:done
          }
        , val:0
        }
        if(last) last.x = 200
        this.add( current, last )
      }
      else if(direction === 1)
      {
        current.x =
        { animation:
          { start:200
          , time:18
          , done:done
          }
        , val:0
        }
        if(last) last.x = -100
        this.add( current )
      }
      else
      {
        this.empty()
        this.add( current )
      }
    }
  , backFallback:function( backStore ){
      //set fallback for back
      var last = backStore[0]
      if(last._name === 'show')
      {
        nav.page.val = 'shows'
      }
      else if (last._name === 'episode')
      {
        nav.show.val = 'showFallback'
      }
    }
  }
).Class

//--------------- app module page level

var MainSwitcherPage = new Element
( { on:
    { animationComplete:
      { parent:'animationComplete'
      , defer:function( update ){
          console.log('ANIMATION COMPLETE!!')
          update()
        }
      }
    }
  , x:
    { animation:
      { easing:'outCubic'
      , time:18
      }
    }
  }
).Class



//------------------ index.js

var Btn = new Element
( { node: 'button'
  , w:app.w
  , text:
    { val: 'set: '
    , add:
      { val:app.user.navigation.page
      , transform: function( val, cv ) {
          return this._name
        }
      }
    }
  , 'events.click': function() {
      app.user.navigation.page.val = this.text.add.val
    }
  }
).Class

var BackBtn = new Element
( { node:'button'
  , 'h,w':100
  , text:'BACK'
  , 'events.click':function(){
      app.switcher.back()
    }
  }
).Class

var ForwardBtn = new Element
( { node:'button'
  , 'h,w':100
  , text:'FORWARD'
  , 'events.click':function(){
      app.switcher.forward()
    }
  }
).Class

var switcher = new MainSwitcher(
{ on:
  { page:nav.page
  , show:nav.show
  , episode:nav.episode
  }
})

app.set(
{ discover:new Btn
, channels:new Btn
, shows:new Btn({w:{val:app.w,divide:3}})
, randomShow:new Btn(
  { w:{val:app.w,divide:3}
  , 'events.click': function() {
      app.user.navigation.show.val = 'show' + Math.random()
    }
  })
, randomEpisode:new Btn(
  { w:{val:app.w,divide:3}
  , 'events.click': function() {
      app.user.navigation.episode.val = 'ep' + Math.random()
    }
  })
, switcher:switcher
, backbtn:new BackBtn(
    // { display:
    //   { val:switcher.previous
    //   , transform:function(v,cv){
    //       console.log('previous transform',cv)
    //       return cv ? 'inline' : 'none'
    //     }
    //   }
    // }
  )
})

APP = app