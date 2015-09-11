exports.$define = {
  $emitInstances: function( emitter, event, context, args ) {

    if( emitter.$instances ) {

      // this.$setContextUp()

      // console.log('%cemit instances', 'color:orange', event.$stamp, this.$path && this.$path.join('.') )

      var instances = this.hasOwnProperty( '_$instances' ) && this._$instances
      var instance
      var parent
      var path
      var property

      //update for instances NOT CONTEXT
      if( instances && !this._$context ) {
        for( var i = 0, length = instances.length; i < length; i++ ) {
          instance = instances[i]
          // console.log('%cemit instance', 'color:orange', event.$stamp, instance.$path && instance.$path.join('.') )

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
          //bit ugly...
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
              // console.group()
              console.log('%ccontext instance emit:', 'color:purple', instance.$path)
              instance.emit.apply( instance, args )
              // console.groupEnd()
            }
          }
        }

        //------------------------------------
        if( stored ) {
          // console.log('lets do it --- clear')
          this._$context = stored.context
          this._$contextLevel = stored.level
          this.$stored = null
          if(!stored.context) {
            this.$clearContextUp()
          }
          // this.$clearContext()
          if( this._$context ) {
            // this._$context.$clearContextUp()
          }
        }
        //------------------------------------

      }
    }

  }
}
