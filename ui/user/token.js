var util = require('../../util')

require('../../value/flags/process')

//TODO: url error on start up (set from cloud)
exports.extend = util.extend
( function( base ) {

  console.log('extend token', base)

  base.extend(
  { //primary
    token: function( val ) { }
  })

  //init:onCloudBind
  //localstorage:'token' //vervang met function later!
  base.token =
  { transform: function( val, cv ) {
      return ( cv instanceof Object ) ? false : cv
    }
  , defer:function( update, args, tempdefer ) {
        
      var _this = this
        , oldval = args
        , val = _this.val
        , caller = _this._caller
        , userId

      userId = caller.id.val

      _this.clearCache()

      if( userId ) {
        console.log('LOGOUT ---> EMIT'.red.inverse, userId )
        caller.cloud.emit('logout', userId )
      }

      if( val ) 
      {

        var request = 
        { url: caller.api.auth.val
        , subs: caller.subscriptions.raw
        , token: val
        //TODO: also add tv
        }

        caller.cloud.authenticate( request, function( res ) {

          // console.warn('\n\n\nauth respone', res)

          //dit kan niet goed gaan! -- switching users! -- rAuth
          
          _this.clearCache()

          if( val !== _this.val ) {
            console.error('\n\n\ndid a fast re-login! -- double check')
          }

          //callback 2 times????
          if( res.error || !_this.val )
          {
            _this.val = false
            caller.id = false
            update()

            // caller.cloud.unsubscribe(['users']) //maybe not?
            if( res.error ) {
              console.error('authenticate error:', res.error)
            } 
            else {
              caller.cloud.emit('logout', res )
              console.error('token is set to false while authenticating (logout! -- need to get a method to break it while in progress)')
            }
          }
          else 
          {
            console.log('AUTH SUC6'.green.inverse, caller, res)
            caller.id = res
            update()
          }
        })
      } 
      else 
      {
        //check if auth in progress -- if in progress delete 
        // caller.cloud.emit('logout', 'username')
        caller.id = false
        update() //use transform voor objecten
      }
    }
  }

})