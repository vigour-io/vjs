var util = require('../../util')

require('../../value/flags/process')

//TODO: url error on start up (set from cloud)


function parseShow( obj ) {
  var title = obj.from.get('title', false).val
    , id = obj.from._name
    , str = 'shows/'+id

  if( title ) str += '-'+title

  return str
}

exports.extend = util.extend
( function( base ) {

  //finish url for current! --maybe add the functionality ? very specific

  //TODO: add remove setting
  base.extend(
  { url: function( val ) {
      if( !val.urlset && val.__t === 4 ) 
      {
        val.urlset = true
        var _this = this
        //reduce url updates check if value is same etc (string compare, do on raf)
        //TODO:!!!gebruik mark als je iets sticky wil!!!!
        // _this.navigation.page.on( function() {
        //   val.from.val = _this.navigation.page.val
        // })

        console.log('do nav!')

        _this.navigation.page.on( function() {
          val.from.val = _this.navigation.page.val //.replace(/ /g,'-')
        })

        _this.navigation.show.on( function() {
          val.from.val = parseShow( this ) //.replace(/ /g,'-')
        })
        // _this.navigation.season.on( function() {
        //   var str = parseShow( _this.navigation.show )
        //   val.from.val = str+'/'+this._name
        // })
        //--season---
        _this.navigation.episode.on( function() {
          var title = this.from.get( 'title', false).val
            //this.from._parent._parent._parent ( === show )
            , str = parseShow( _this.navigation.show )
                  + '/'+( ( Number( this.from._parent._parent._name ) + 1)  )
                  + '/'+( Number( this.from._name )+ 1 )
          if( title ) str += '-'+title
          
          // str.replace(/ /g,'-')

          val.from.val = str
        })

        val.from
          .on( function( ) {

            // console.log('update from url!'.gree.inverse)

             var url = val.from.string.val
               , nav = _this.navigation
               , data = _this.data
               , urlArray
               , show
               , season
               , episode
               , channel

             if( !~url.indexOf( '/' ) )
             {
               nav.page.userFrom = url
             }
             else if( url.indexOf( 'shows' ) === 0 ) 
             {
               urlArray = url.split( '/' )
               show = Number( urlArray[1].split( '-' )[0] )
               if( urlArray[2] ) season = Number( urlArray[2] ) 
               if( urlArray[3] ) episode = Number( urlArray[3].split('-')[0] )

               if( show ) {
                  show = data.from.get( [ 'shows', show ] )
                  // if( nav.show.from !== show )
                  // {
                    console.log('\n\n\n---', show)
                    nav.show.userFrom = show
                  // }
               } 

              if( season ) {
                // season = data.from.get( nav.show.from._path.concat( [ 'seasons', season-1 ] ) )
                // if( nav.season.from !== season )
                // {
                //   //from gaat door naar de uiteindelijke
                //   nav.season._val.val = season //check eerst de user .val.val zoiets
                // }
              }
              console.log('EPISODE'.inverse, episode, season, urlArray)
              if( episode ) {

                episode = data.from.get( nav.show.from._path.slice(3).concat( [ 'seasons', String( season-1 )  ,'episodes', String( episode-1 ) ] ) )
                // if( nav.episode.from !== episode )
                // {
                  console.log('lezzzzgo', episode)
                  nav.episode.userFrom = episode
                // }
              } 

             }
             else if( url.indexOf('channels') === 0 )
             {
              urlArray = url.split( '/' )
              channel = Number( urlArray[1].split( '-' )[0] )
             }

          })

      } else {
        console.warn( 'ui.user: no url!' )
        //console.log() use deze voor updates?
      }
    }
  })

})