var util = require('../../util')
  , Value = require('../../value')
  , url = require('../../browser/network/url')

require('../../value/flags/process')

exports.extend = util.extend( function( app ) {

  app.initialised = new Value( false )
  
  app.region = new Value({ init: app.initialised })

  app.url = url //ook pas op app initilised!

  //add localstorage
  app.language = new Value(
  { val: function() {
  		return window.navigator.userLanguage
	    		|| window.navigator.language
	        || app.region.val.toLowerCase()
  	}
  , transform: function( val, cv ) {
  		return cv ? cv.slice(0,2) : false
  	}
  , init: app.initialised 
  })

  //[ 'main' , 'second' , 'player' ]
  app.state = new Value({ init: app.initialised })

  //[ 'channel' , 'episode', 'mainscreen.episode' ]
  app.playing = new Value()
  //localstorage

  app.fullscreen = new Value({force:true})

  app.notification = new Value()

  app.loader = new Value()

  app.volume = new Value()

  // app.roadblock = new Value()
  // app.notification = new Value()
  // app.loader = new Value()
  // app.purplePages = new Value()

})