require('../../value/flags/self')
require('../../value/flags/process')
require('../../value/flags/util')
//TODO: clean these to work /w inject

var util = require('../../util')
  , Value = require('../../value')
  , vObject = require('../../object')
  , Base = require('../../base')
  , valueBase = require('../../value/base')
  , user = new Base( { defaultType: valueBase.type } )
      .inject 
      ( require( '../../value/on' )
      )
  , userBase
  , NetworkData = require('../../browser/network/data')
  , vObject = require('../../object')
  , timestamp = require( 'monotonic-timestamp' )
  , CloudData = require( '../../browser/network/cloud/data' )

util.define
( CloudData
, '_contentPath'
, { get: function() {
      //this is dirty! but good for now
      // console.log( 'immma gettin _contentPath', base.instances[0].data.from._path )
      //ff beter doen
      var p = this._path
      for(var i in p ) {
        if( p[i] === 'shows' || p[i] === 'channels' ) {
          return p.slice( i )
        }
      }
      return p
      // return this._path.slice( base.instances[0].data.from._path.length )
    }
  }
)

//user operator

/*
  nog een soort userFrom (non updating!)
*/

//require('../../value/flags/ajax sowieso!') //ajax fallback voor node ( unificate )
//use all flags you want
//value type om die switch goed te doen?

/*
  content handle
  add alle listeners voor user in user! lsitened rustig op change
  cloud / cloud.data
  id
*/

//subscriptions
var model = new NetworkData
  (
    { role: 'free'
    , usage:false
    , first_name: false
    , last_name: false
    , newsletter: false
    , language: false
    , search:false
    , highlight:false //previously known as shine
    , mainscreen:
      { client: false
      , episode: false
      , volume: 1
      , playing: false
      }
    , navigation:
      { show: false
      , page: false
      , season: false
      , episode: false
      , channel: false
      , last: { key: 'page', time: 0 }
      }
    }
  )
, subscriptions = 
  { role: true
  , first_name: true
  , last_name: true
  , email:true
  , search:true
  , highlight:true
  , language: true
  , newsletter: true
  , navigation: 
    { show:true
    , episode:true
    , season:true
    , channel:true
    , page:true
    , last: {
        key:true
      , time:true
      }
   }
  , mainscreen: 
    { clientRef: true
    , episode: true
    , volume: true
    , playing: true
    } 
  , lastActiveClient:true
  , usage: 
    { shows:
      { $:
        { episode: true
        , favourite: true 
        , time: true
        } 
      }
    }
  }

var _coreSet = vObject.set
  , _fromUser = this.from = function( obj ) {
      var val = obj
        , nav
        , last

      while (val instanceof vObject) {

        if( val._parent && val._parent._prop && val._parent._prop.name === 'navigation' ) {
          nav = val
        } 

        if( val.cloud && val._path[0] === 'users' || val._ancestor(model) ) {
          return [ val, nav ]
        }
        last = val;
        val = val._val;
      }
      return [ last !== obj ? last : false, nav  ]
    }


util.define( vObject, 'userFrom', {
  set: function( val ) {

    var search = _fromUser(this)
      , found = search[0] //|| this
      , nav = search[1]
      , same

      // console.log('USER FROM---'.cyan.inverse, found._path, this._path, this._parent, val )
    if( !found 
      && this._name === 'client' 
      && this._parent 
      && this._parent._prop.name === 'mainscreen' ) {
      //TODO: clean this generelize it 
      //currentUser
     console.log('CLIENT IS REMOVED'.red.inverse, this._parent._caller.currentUser.from )
     //this._parent._caller.currentUser.from._path
     found = this._parent._caller.cloud.data
      .get( this._parent._caller.currentUser.from._path.concat([ 'mainscreen', 'clientRef' ]), false )
     this.val = found
    }

    _coreSet.call( found , val)

    if(nav && nav._name ) {

      console.log( 'USER FROM NAV'.cyan.inverse )

      // nav._parent.last.__fromSelf__ = true
      nav._parent.last.from.val = 
      { time: timestamp()
      , key: nav._name
      }
      // nav._parent.last.__fromSelf__ = null
      // if(found._val === val) {
      //   // alert('same!')
      //   same = true
      // }
    }
    // if( same ) {
    //   found._update(val)
    // }

  },
  get: function() {
    console.log()
    return _fromUser( this )[0] //|| this
  }
})

//manage vanuit model!
//special type maken die subscriptions goed handeled! --- nu kan je niet subscriben op een Value -- dat moet kunnen
//Component
user.inject( require('./id') )

function navigationReset( data, obj, key ) {
  //find a new page
  if( obj.from  ) 
  {
    if( !obj.checkParent( data.from ) ) 
    {
      if( key === 'show' ) {
        console.log('RESET SHOW!')
        // var path = obj.from._path
        if( this.last.from.get( 'key' ).val === key ) {
          // alert('*'+key)
          // console.log('navRESET'.red.inverse)
          obj.userFrom = data.from.get( obj.from._contentPath )
        } else {
          // console.log('navRESET -- cant find last'.red.inverse)
          obj.userFrom.val = data.from.get( obj.from._contentPath  )
        }
        
      }
    }
  }

}

user
  .define
  ( 
    { data:
      { type:false
      , get: function() {
          console.log( 'get DATA?' )
          return this._data
        }
      , set: function( val ) {

          //mischien niet overal values in gooien?
          var _this = this

          //self is nog beetje sketchy
          val.on( 'self', function() {

            console.log( 'I have changed my CONTENT datas by a change to user.data'.green.inverse, 'this:',this )
            //switch , episode, season, show and channel

            _this.navigation.each( function( key ) {
              if( key !== 'page' ) 
              { 
                navigationReset.call( _this.navigation, val, this, key ) 
              }
            })

          } )

          console.log('set DATA? set ook change? maybe map?', val)
          this._data = val
        }
      }
    , cloud :
      { type:false
      , get: function() {
          return this._cloud
        }
      , set: function( val ) {

          var _this = this

          if( this._cloud ) {
            console.error( 'ui.user: Already have cloud cannot switch now!' )
            return
          }

          _this._cloud = val

          val.on( 'reconnect', function() {
            console.log('ui.user: Reconnect cloud' )
            //on remove add some stuff

            // _this.token.update()
          })

          //this.on als function???
          // _this.on( 'remove' , function() {
          // })
        }
      }
    , switchToModel: function() { 
        var _this = this
        this.model.from.each(function( key ) {
          if( _this.switchToModelDataKeys[ key ] ) 
          {
             _this.switchToModelDataKeys[ key ].call( _this, this, key )
          } 
          else
          {
            _this[ key ] = this
          }
        })
      }
    , switchToUserData: function( userData ) {

      // console.log(key)

        var _this = this
        this.model.from.each(function( key ) {
          if( _this.switchToUserDataKeys[ key ] ) 
          {
             _this.switchToUserDataKeys[ key ].call( _this, userData, this, key )
          } 
          else
          {
            _this[ key ] = userData.get( key, this.val )
          }
        })
      } 
    , switchToUserDataKeys: { 
        value: {
          navigation: function( userData, modelEntry, key ) {

            //hier ook listeners op hangen userFrom is alleen maar een xtratje voor dingen die hetzelfde zijn!

            //set zonder update
            this.navigation = {
              last: userData.get( [ key, 'last' ] )
            }

            var nav = this.navigation

            //haal deze listener weg!!!!
            nav.last.from.on(function( val, stamp, from ) {
              //alleen vanaf cloud!
              console.log( '-----LAST----'.cyan.inverse, this.key.val, val )
              // app.myblurf.text = { add: ' ---> LAST!'+Math.random()*999999 }
              //---mischien alleen vanuit last doen? nooit vanuit het ding zelf?
              if( nav[this.key.val] )  //&& !nav.last.__fromSelf__
              {
                //alleen doen if its the same!
                nav[this.key.val].from._update( void 0, 'l'+stamp  )
              }
            })

            // alert( 'switch NAV to user!' )
             this.navigation = 
            { page: userData.get( [ key, 'page' ] ) 
            , show: userData.get( [ key, 'show' ] )
            , season: userData.get( [ key, 'season' ] )
            , episode: userData.get( [ key, 'episode' ] )
            , channel: userData.get( [ key, 'channel' ] )
            }

            if(nav.last.from.key) {
              nav.last.from._update( void 0, vObject.stamp() )
              console.log('-------------\n\n\n\n'.blue)
            }

          }
        } 
      }
    , switchToModelDataKeys: { 
        value: { //seperator navigation later
          navigation: function( modelEntry, key ) {
            var nav = this.navigation
              , set = 
                { page: modelEntry.page
                , show: modelEntry.show
                , season: modelEntry.season
                , episode: modelEntry.episode
                , channel: modelEntry.channel
                } 

            this.navigation = { last:  modelEntry.last }

            for( var key$ in set )
            {
              // console.log(key$)
              if( key$ === 'last' || nav[ key$ ]._val && nav[ key$ ]._val._val )
              {
                if( key$ === 'last' )
                {
                  if( nav[ key$ ].from.get('time').val )
                  {
                    modelEntry[ key$ ].time = nav[ key$ ].time.from.val
                    modelEntry[ key$ ].key = nav[ key$ ].key.from.val
                  }
                }
                else if( key$ === 'page' )
                {
                  modelEntry[ key$ ].val = nav[ key$ ].from.val
                }
                else 
                {
                  modelEntry[ key$ ].val = nav[ key$ ].from
                }
              }
            }
            //need to use setter (not nav ref)
            this.navigation = set
          }
        } 
      }
    }
  )

user
  .extend
  (
    { 
      //derived
      subscriptions:function(){}
    , email:function(){}
    , first_name:function(){}
    , last_name: function() {}
    , model: function(){}
    , navigation: function( val ) {
        console.log('SOMETHING IS HAPPENING TO NAVIGATION!', val.page.val )
      }
      //primary
    , language: function() {
        console.log('IM SETTING LANGUAGE!') 
      }
    , api:function(){}
      //derived
      //derived
    , profilePic: function() {

      }
      //ROLE [ 'free', 'trial', 'premium', 'vip' ] //anonymous?
    , role: function() {

      }
      //derived
    , availableClients: function() {

      }
      //primary
    , newsletter: function() {

      }
    , search: function() {

      }
    , highlight: function() {

      }
    }
  )

//TODO: set on base values
//user = new user.Class()

//--------------------------------DEFAULTS-------------------------------
user.model = model

user.subscriptions = subscriptions

user.navigation =
{ page: { defer: deferNavigation }
, show: { defer: deferNavigation }
, season: { defer: deferNavigation }
, episode: { defer: deferNavigation }
, channel: { defer: deferNavigation }
}

//select default voor season!
user.api = {
  auth: false
}
// userBase.url = {}

user.language = 
{
  default: { default: 'en' }
}

function deferNavigation( update, args )  {
  // console.log( 'DEFER NAV'.grey.inverse, this._name, '\nupdateOrigin:',this._updateOrigin, this._fromPath, args )
  if( args[1] && args[1][0] === 'l'  ) 
  {

    // this.clearCache()
    // console.log( args[0],  'try -----UPDATE'.green.inverse, this._name, args, '\n fromPath',  this._updatePath, this.from, 'KEY!',this._parent.last.from.key.val )
    // if(this._lstamp === args[1]) {
    //   return true
    // }
    // this._lstamp = args[1]

    //TODO: FIX TEMP HACK
    // args[0] = void 0
    // if( this._name === user.navigation.last.from.key.val ) {
      // console.log( '-----UPDATE'.green.inverse, this._name, args )
    

    if( this._name === this._parent.last.from.key.val ) 
    // args[0] = this._parent.last.from.key.val
    {
      console.log('DO UPDATE'.green.inverse, this._name )
      this.clearCache()
      update()
    } else {
      update(true)
    }
   
  } 

  // return true
  update( true )
} 

module.exports = exports = user.Class
exports.base = user


// function deferNav( update, args )  {
//   if( this._parent.last.from 
//     && this._parent.last.from.get('key').val === this._name 
//     && !this.__timestamp__  
//        || (this.__timestamp__ !== this._parent.last.from.get('time').val) 
//     ) 
//   {

//     if(args[0]) {
//       this.__larg__ = args[0]
//     } else {
//       console.log('????????', this.__larg__,  this.__tempdefer__)
//       args[0] = this.__larg__
//     }

//     //this._parent.last.from.get('key').val
//     this.__timestamp__ = this._parent.last.from.get('time').val

//     // this.clearCache()
//     console.log( 'UPDATE'.green.inverse, this._parent.last.from.get('time').val, this._name, args, this._lstamp )
//     update()
//   } else {
//     // return true
//     update( true )
//   }
// } 





//maak het mogelijk hierop te subscriben door in data + subscribe te checken anar de form van vobjects en values
