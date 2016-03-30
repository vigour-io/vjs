/*
  devicesPresentCase
  thereIsAMainscreen
  mainscreen

  mainscreen
    client
    episode
    volume
    playing
  client
  availableClients ( derived )
  lastActiveClient 
  mainid -- first try without! just do a reference to a client -- if this breaks let marcus fix it on the cloud (sticky clients!!!!)
*/

var cases = require('../../browser/cases')
  , util = require('../../util')
  , ua = require('../../browser/ua')
  , Data  = require('../../data')
    .inject( require('../../data/selection') )
  //------------------DEBUG---------------
  , app = require('../app')

function setClientInfo( user ) {

  user.client = user.cloud.data.get([ 'clients', user.cloud.clientid ])

  var title
    , device
    // , id = exports.mainId || (exports.mainId = (Math.random()*9999999999)|0)
  if( cases.ios ) 
  {
    title = ua.device === 'phone' ? 'iphone' : 'ipad'
    device = ua.device === 'phone' ? title : ua.device
  } else 
  {
    if( ua.platform === 'appletv' )
    {
      title = 'Apple TV'
      device = 'airplay'
    }
    else if( cases.cast )
    {
      title = 'Chromecast'
      device = 'cast'
    }
    else
    {
      device = ua.device
      title = cases.desktop ? ua.platform : ua.platform+' '+device
    }
  }
  //hier ook ff native bij schrijven
  user.client.val =
  { title: title
  , device: device
  , key: user.cloud.clientid
  //mayeb add screensize??? do all kinds of funky stuff here
  // , mainid:id
  }

}

exports.extend = util.extend
( function( base ) {

  base.extend
  (
    { mainscreen: function( val ) {} //maak special type voor user (dit is onzin!, ga nu uit van 1 user altijd!)
    , availableClients: function() {}
    , lastActiveClient: function() {}
    } 
  )

  base.mainscreen = {
    client:{ 
      transfrom: function( c, cv ) {

        console.log('MAINSCREEN VALUE GET ON CLIENT'.magenta.inverse, cv, c )
        return cv
      } 
    } //ref
  , episode:false // ref
  , volume:{ default: 1 }  //real [0-1] //default 1
  , playing:{ default: false }  //[true/false]
  }

  base.availableClients = {}

  //make a on cloud hook here as well!!!!

  base.switchToUserDataKeys.mainscreen = function( userData, modelEntry, key ) {
    
    //DEBUG
    app.output.html = app.output.html.val += '\nINIT MS'

    this.cloud.subscribe({
      clients:{ 
        $: 
        { title: true
        , device: true
        , key: true
        } 
      }
    })

    setClientInfo( this )

    this.availableClients = new Data 
    ( this.cloud.data.get('clients')
    , { block:true
      , condition:
        { device: {
            $contains: '(desktop)|(tv)|(cast)|(tablet)|(airplay)'
          }
        , key:
          { $exists:true
          , $ne: this.cloud.clientid
          }
        }
      }
    )

    this.mainscreen = 
    { client: userData.get( ['mainscreen', 'clientRef' ], false )
    , episode: userData.get([ 'mainscreen', 'episode' ]) 
    , volume: userData.get([ 'mainscreen', 'volume' ]) 
    , playing:userData.get([ 'mainscreen', 'playing' ]) //[true/false]
    }

    this.mainscreen.client.from.on(function() {
      console.log('client????', arguments )
    })

    var availableClients = this.availableClients

    availableClients._val.on(function( val, stamp ) {
      availableClients.clearCache()
      availableClients._update( val, stamp )
    })

    //----TEMP-----
    this.__ms__ = true

  }

  base.switchToModelDataKeys.mainscreen = function( modelEntry, key ) {
    if( this.__ms__ ) {
      alert('NOT IMPLEMENTED REMOVE MULTISCREEN STUFF')
    }
  }

} )

