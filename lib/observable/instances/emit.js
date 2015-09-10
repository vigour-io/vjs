exports.$define = {
  $emitInstances: function( emitter, event, context, args ) {

    if( emitter.$instances ) {

      var instances = this.hasOwnProperty( '_$instances' ) && this._$instances
      var instance
      var parent
      var path
      var property

      //update for instances NOT CONTEXT
      if( instances && !this._$context ) {
        for( var i = 0, length = instances.length; i < length; i++ ) {
          instance = instances[i]
          instance.emit.apply( instance, args )
        }
      }

      //THIS IS THE UPDATE FOR CONTEXT
      //this has to go way way faster
      if( ( parent = this.$parent ) ) {

        path = [ this.$key ]

        var orig
        var contextInstances
        var stored

        //------------------------------------
        if(!this.hasOwnProperty('$stored')) {
          stored = this.$stored = this.$storeContext()
        }
        //------------------------------------

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
              instance.emit.apply( instance, args )
            }
          }
        }

        //------------------------------------
        if( stored ) {
          this._$context = stored.context
          this._$contextLevel = stored.level
          this.$stored = null
          if( this._$context ) {
            this._$context.$clearContextUp()
          }
        }
        //------------------------------------

      }
    }

  }
}
