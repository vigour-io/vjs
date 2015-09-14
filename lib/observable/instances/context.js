exports.$define = {
  $emitContext: function ( emitter, event, args ) {
    //THIS IS THE UPDATE FOR CONTEXT
    if(emitter.$instances) {
      var parent
      var orig
      var contextInstances
      var stored
      var instance
      var property
      var path
      //this has to go way way faster
      if( parent = this.$parent ) {
        path = [ this.$key ]
        // this.$path

        if(!this.hasOwnProperty('$stored')) {
          stored = this.$stored = this.$storeContextChain()
        }

        while( parent ) {
          if( parent.hasOwnProperty('_$instances') ){
            orig = parent
            contextInstances = parent._$instances
            break
          }
          path.push( parent.$key )
          parent = parent.$parent
        }

        if( contextInstances ) {
          for( var i = 0, length = contextInstances.length; i < length; i++ ) {
            instance = contextInstances[i]
            for ( var j = path.length - 1; j >= 0; j-- ) {
              property = path[j]
              instance = instance[ property ]
            }
            if(instance){
              if(instance.$on && instance.$on[emitter.$key] === emitter) {
                emitter.$pushBind( instance, event )
                instance.$emitContext( emitter, event, args )
              }
            }
          }
        }

        if( stored ) {
          this.$setContextChain( stored )
          delete this.$stored
        }
      }
    }
  }
}
