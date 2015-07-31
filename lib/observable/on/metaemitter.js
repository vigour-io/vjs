var Emitter = require('../../emitter')

var MetaEmitter = module.exports = new Emitter({
	$define: {
		$meta: true,
		$emit: function metaEmit( event, bind, force, meta ) {
			console.log('HA! overwreitten shkills', bind && bind.$path)
      if( this.$lastStamp !== event.$stamp ) {
        if( !force ) {
          console.log('meta boy postpone!')
          this.$postpone( bind, event )
        } else if( !event.$block ) {

          console.log('meta boy do not postpone!', force)

          if( bind ) {
          	console.log('haha pushBind')
            this.$pushBind( bind, event )
          }

          this.$exec( bind, event )
        }
      }
		}	
	}
}).$Constructor
