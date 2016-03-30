var util = require( '../../util' )
  , Data = require( '../../data' ).inject( require('../../data/selection' ) )
  , CloudData = require( '../../browser/network/cloud/data' )


require( '../../value/flags/process' )

exports.extend = util.extend
( function( base ) {

  // Data.prototype._contentPath

  //TODO:lang switch

  base.extend
  //primary
  ({ usage:function() {}
  //derived
  , watched: function() {}
  //derived
  , favourites:function() {}
  })   

  function setFavos( userData, modelEntry, key, usage ) {

    if( this._favos ) 
    {
      // console.warn('I ALLREADY HAVE FAVOS!', 'must be switching users')
      this._favos.remove()
    }


    console.log('FAVOS!!!'.cyan.inverse)
    var _this = this
      , favos = this._favos = new Data( usage.get( 'shows' ), { condition: { favourite: true } })

    console.log('FAVOS END!!!'.cyan.inverse)


     favos.on(function( val, stamp, from, remove, added, oldval ) {
        //TODO: lets make it really easy to create these kind of maps!
        //DIT MOET ECHT VERMINDERD WORDEN! HET IS NU OP ALLES
        // console.log( 'favourites!'.cyan.inverse,  val, stamp, from, remove, added, oldval, JSON.stringify( this.raw, false, 2 )  )
        this.each( function( key ) {
            // console.log('FAVO!', key, this._contentPath,  _this.data.from.get( this._contentPath ) )
            //deze dus ook changes op language!
            if(! _this.favourites.from[ this._name ]  ) {
              _this.favourites.from.set( this._name ,  _this.data.from.get( this._contentPath ) )
            }
        })

        _this.favourites.from.each( function( key ) {
          var found
          for(var i in favos) {
            if( favos[i] && favos[i]._name && key === favos[i]._name ) {
              if( !favos[i].favourite.val ) {
                break
              }
              found = true
              break
            }
          }

          if( !found ) {
            this.remove()
          }

        })
     })
     favos._update()

  }

  //TODO: have to fix this!!!! --- when remove, when logout etc when changing lang change episode (or maybe not?)
  function setWatched( userData, modelEntry, key, usage ) {
    console.log('WATCHED!!!'.cyan.inverse)

    if( this._watched ) 
    {
      // console.warn('I ALLREADY HAVE WACTHED!', 'must be switching users')
      this._watched[1].removeListener(this._watched[0])
      // this._watched.remove()
    }

    var _this = this
    
    this._watched = [ function( val, stamp, from, remove, added, oldval ) {
      // console.log( 'watched!'.cyan.inverse )
      this.each( function( key ) {
        if(! _this.watched.from[ this._name ] && this.episode && this.time ) 
        {

          // console.log('MAKE IT!!'.cyan, key, this.episode.val )
          //hier listener!

          _this.watched.from.set
          ( this._name ,  
            { show: _this.data.from.get( this._contentPath )
            , episode: this.episode
            , time: this.time
            } 
          )
        }
       

      })

     } , usage ]

     usage.get( 'shows' ).on( this._watched[0] )
     usage.get( 'shows' )._update()  

    console.log('WATCHEDEND!!!'.cyan.inverse)

  }
  
  base.switchToUserDataKeys.usage = function( userData, modelEntry, key ) {

    console.log('USAGE'.magenta.inverse)
    var usage = userData.get( key ) 

    this[ key ] = usage

    setFavos.call( this, userData, modelEntry, key, usage )
    setWatched.call( this, userData, modelEntry, key, usage )

    //favorites
  }

  base.switchToModelDataKeys.usage = function( modelEntry, key ) {

    //favorties
    if( this._favos ) {
      this._favos.remove()
      this.favourites.from = {}
    }

    //watched
    // if( this._watched ) {
    //   this._watched.remove()
    //   this._watched.from = {}
    // }

    this[ key ] = modelEntry

  }
         
  base.usage = {}
  base.favourites = { val: new Data() } //hoe dan? favos laten disapearen
  base.watched = { val: new Data() }

})