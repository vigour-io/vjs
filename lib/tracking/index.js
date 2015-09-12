//injectable


var trackingEmitter = require('./emitter')

//globa tracking emitter

//something for defaults

// exports.$define = {
//   $trackSettings: {
//     value: {
//
//     }
//   }
// }

exports.$flags = {
  $track: function( val, event ) {

    /*
      val:true
      val:String
      val: Function
      val:Array (welke dingen je wil doen)
      val: {
        EMITTERKEY: {  do something special }
      }
    */

    console.error(val, event) //set event
    if( val === true ) {
      console.error('TRUE TRACKIN\'-----')

      //now also for all emitters that are allready there
      //this.$on --- each

      if(this.$on) {
        this.$on.each( function( emitter, key ) {
          console.log('%cshall i add a tracking listener on this emitter? --->', 'background:#333;color:white;', '\n', key )

          if(key === '$error') {
            //do spesh!
            //default -- dit moet ook uit een object komen
          }

          emitter.on('track', function( event ) {
            trackingEmitter.emit( event, false, false, key, this  )
          })


        }, function( property, key ) {
          return key !== '$value'
        })
      }

      this.on('$value', function( event, previousValue ) {
        trackingEmitter.emit( event, false, false, '$value', this, previousValue  )
      }, 'track')

    }

  }
}

/*
 - start met error handelere -- emit uitleggen error meegven infos knallen
 - dan tracking
*/
