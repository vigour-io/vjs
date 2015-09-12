var Emitter = require('../emitter')
var emit = Emitter.prototype.emit

module.exports = new Emitter({
    $define: {
      $plugins: { value: {} },
      //extraStuff can be id, value, more!
      emit: function(event, bind, force, meta, extraStuff) {

          for( var service in this.$plugins ) {
            console.log( '%chey got this plugins! have to send to some service', 'color:purple;font-weight:bold;' ,
              '\nto this SERVICE:', service, '\n', meta.$path, extraStuff
            )
          }

          //GA.call
          //Omni call
          //vigour rick tracking service

          console.log('omg omg omg wtf wtf wtf')

      }
    }
})
