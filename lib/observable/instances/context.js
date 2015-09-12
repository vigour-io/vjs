exports.$define = {
  $updateContext: function ( emitter, event, args ) {
    //THIS IS THE UPDATE FOR CONTEXT
    var parent
    //this has to go way way faster
    if( parent = this.$parent ) {

      path = [ this.$key ]
      var orig
      var contextInstances
      var stored
      var instance
      var property
      var path

      //------------------------------------
      if(!this.hasOwnProperty('$stored')) {
        //have to use delete everywhere....
        stored = this.$stored = this.$storeContextChain()
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
            // console.log('%ccontext instance emit:', 'color:purple', instance.$path)
            emitter.$pushBind( instance, event )
            instance.$updateContext( emitter, event, args )
          }
        }
      }

      //------------------------------------
      if( stored ) {
        this.$setContextChain( stored )
        delete this.$stored
      }
      //------------------------------------
    }
  }
}
