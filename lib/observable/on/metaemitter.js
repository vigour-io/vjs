var Emitter = require('../../emitter')

var MetaEmitter = module.exports = new Emitter({
	$define: {
		$meta: true,
		$emit: function metaEmit( event, bind, force, meta ) {
      if( this.$lastStamp !== event.$stamp ) {
        if( !force ) { // only change is here
          this.$postpone( bind, event )
        } else if( !event.$block ) {
          if( bind ) {
            this.$pushBind( bind, event )
          }
          this.$exec( bind, event )
        }
      }
		}
	}
}).$Constructor
