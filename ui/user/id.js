var util = require('../../util')

require('../../value/flags/process')

exports.extend = util.extend
( function( base ) {

    base.extend
    ( 
      { id: function(val) {

          var id = val.val

          if( id && this.cloud ) 
          {
            // console.log('ID')
            this.currentUser = this.cloud.data.get([ 'users', id ])
          } 
          else if( !id && this.switchToModel ) 
          {
            // console.log('FALSE', this)
            this.currentUser = false
            // console.log('FALSE i FY')

            //hier logout handelen?
          }
        }
      , currentUser: function( val ) {

          // console.log('------'.yellow.inverse, val)

          if( val.from.cloud  ) 
          {
            if( this.___c !== val.from ) 
            {
              this.___c = val.from
              // console.log('lets switch to user?', val)
              this.switchToUserData( val.from )
            }
          }
          else 
          {
            //dit gaat fout omdat het op zn class word geset
            if( this.___c === false ) return
            this.___c = false
            // console.log('lets switch? to mock', this)
            this.switchToModel()
          }

        }
      }
    )

    // base.id = false //set zonder update!

    //  base.setSetting({ 
    //     name:'id'
    //   , new:function() {
    //       console.log('??121212?!!!'.yellow.inverse)
    //       this.id = false
    //     }
    // })

} )
