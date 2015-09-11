//injectable


var trackingEmitter = require('./emitter')

//globa tracking emitter

//something for defaults

exports.$flags = {
  $track: function( val, event ) {

    console.error(val, event) //set event
    if(val === true ) {
      console.error('-----')

      //now also for all emitters that are allready there
      //this.$on --- each

      if(this.$on) {
        this.$on.each( function( property, key ) {
          console.log('%cshall i add a tracking listener on this emitter? --->', 'background:#333;color:white;', '\n', key )

          if(key === '$error') {
            //default -- dit moet ook uit een object komen
          }

          property.on('track', function() {

          })


        }, function( property, key ) {
          return key !== '$value'
        })
      }

      this.on('$value', function( event, meta ) {
        console.log('lezzcheck this!', event, meta )
      }, 'track')

    }

  }
}

/*
 - start met error handelere -- emit uitleggen error meegven infos knallen
 - dan tracking
*/
