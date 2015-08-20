var cnt = 0

exports.$define = {
  $emitInstances: function( emitter, event, context, args ) {

    // cnt++
    // if(cnt> 12550) {
    //   //easier for debugging
    //   throw new Error('too much emitInstances')
    // }

    if( !emitter.$noInstances ) {

      var instances = this.hasOwnProperty( '_$instances' ) && this._$instances
      var instance
      var parent
      var path
      var property

      //update for instances NOT CONTEXT
      if( instances && !this._$context ) {
        for( var i = 0, length = instances.length; i < length; i++ ) {
          instance = instances[i]
          instance.$emit.apply( instance, args )
        }
      }

      //THIS IS THE UPDATE FOR CONTEXT
      if( ( parent = this.$parent ) ) {

        path = [ this.$key ]

        var lcontext
        var orig
        var contextInstances
        var contexts

        if(!this.hasOwnProperty('_$lcontext')) {
          lcontext = true
          if( this._$context ) {
            this._$lcontext = this._$context
            this._$llevel = this._$contextLevel
          } else {
            this._$lcontext = true
            if( parent._$context ) {
              if(!contexts) {
                contexts = []
              }
              contexts[ path.length-1 ] = parent._$context
            }
          }
        }

        while( parent ) {
          if( parent.hasOwnProperty('_$instances') ){
            orig = parent
            // console.log(
            //   '\nparent loop - found instances for:', orig.$path,
            //   '\ngenerated path:', path
            // )
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
              instance.$emit.apply( instance, args )
            }
          }
        }

        if( lcontext && this._$lcontext !== true ) {
          this._$context = this._$lcontext
          this._$contextLevel = this._$llevel
          this._$context.$resetContextsUp()
        }

      }
    }

  }
}
