"use strict";
exports.$inject = require('../../methods/lookUp')

exports.$flags = {
  $trackInstances: function( val ) {
    this.$trackInstances = val
  }
}

var cnt = 0

exports.$define = {
  $addToInstances: function( event ) {
    var proto = Object.getPrototypeOf( this )
    if( !proto.hasOwnProperty( '_$instances' ) ) {
      proto._$instances = []
    }
    proto._$instances.push( this )
  },
  $removeFromInstances: function( event ) {
    var proto = Object.getPrototypeOf( this )
    if( proto.hasOwnProperty( '_$instances' ) ) {
      for( var i in proto._$instances ) {
        if(proto._$instances[i] === this) {
          proto._$instances.splice( i,1 )
          break;
        }
      }
    }
    if( this.hasOwnProperty( '_$instances' ) ) {
      var instances = this._$instances
      for(var i = 0, length = instances.length ; i < length; i++ ) {
        instances[i].remove( event )
        i--
        length--
      }
    }
  },
  $emitInstances: function( emitter, event, context, args ) {
    cnt++
    if(cnt> 250) {
      //easier for debugging
      throw new Error('too much emitInstances')
    }
    if( !emitter.$noInstances ) {
      var instances = this.hasOwnProperty( '_$instances' ) && this._$instances
      var instance
      var parent
      var path
      var property

      // if( !this.hasOwnProperty( '_$instanceStamp' ) || this._$instanceStamp !== event.$stamp ) {

        // console.info( '%cinstancesEmit','color:purple;font-weight:bold;' )

        // this._$instanceStamp = event.$stamp //combi with context

        //fine for change not fine for custum stuff where you want to emit on instances of instance with a context

        if( instances && !this._$context ) {
          //dont do this when context, but may do context when instances
          // console.info( '%cinstances and no context','color:purple;font-weight:bold;' )
          for( var i = 0, length = instances.length; i < length; i++ ) {
            instance = instances[i]
            instance.$emit.apply( instance, args )
          }
        }

        if( ( parent = this.$parent ) ) {

          //need to do better for every update now! super slow!!!

          //pure horror --- how to figure out to do this?
          //sometimes it needs to be ignored sometimes it should not be ignored :/
          //now this case this._$context this is not correct!
          //this is only testable by not setting but emitting emitters
          //update on a virtual thing within instances -- what to do?
          // this._$instanceStamp
          //!context is ofcourse wrong

          path = [ this.$key ] //wel ff deze erbij

          // console.group()
          //
          // console.info( '%cTrying context emits','color:purple;font-weight:bold;'
          // , '\n original', this._$path
          // , '\n contextPath:', this.$path )
          // console.log(
          //   ' has context:', !!this._$context
          // , '\n parent orig path:', parent._$path
          // , '\n this orig path:', this._$path
          // , '\n parent context path:', parent.$path
          // , '\n this context path:', this.$path
          // , '\n from -- if empty is obs:' , Object.getPrototypeOf( this )._$path
          // )

          var lcontext
          var orig
          var contextInstances

          if(!this.hasOwnProperty('_$lcontext')) {

              //clean this up not nessary yet!

            // console.log('%c_$lcontext set', 'font-weight:bold;color:blue;')
            lcontext = true
            if( this._$context ) {
              //needs to store whole path here
               this._$lcontext = this._$context
               this._$llevel = this._$contextLevel
            } else {
              this._$lcontext = true
            }
          }

          while( parent ){
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
              // console.log( 'instance:', contextInstances[i] )
              for ( var j = path.length - 1; j >= 0; j-- ) {
                // console.log( '%cget path segment:'+path[j],'color:purple;font-weight:bold;')
                console.group()

                property = path[j]
                instance = instance[ property ]
                console.groupEnd()

              }
              if(instance){
                // console.info( '%ccontext-instance emit for','color:purple;font-weight:bold;',
                //  '\n context path:', instance.$path ,
                //  '\n real path:', instance._$path
                //
                // )
                instance.$emit.apply( instance, args )

              }
            }
          }

          if( lcontext && this._$lcontext !== true ) {
            // console.error('reset my lcontext', this._$path, this._$lcontext._$path, this._$llevel)
            //for each in context change it pack
            this._$context = this._$lcontext
            this._$contextLevel = this._$llevel
            this._$context.$resetContextsUp() //context*

            // var lparent =  this
            // for(var i = 0 ; i < this._$llevel; i++) {
            //   lparent = lparent._$parent
            //   lparent._$context =  this.$parent
            //   lparent._$contextLevel = this._$llevel-1
            // }
            //voor elk level dus arraytje

            //context level moet worden bijgehouden
          }

          //make this more re-usable
          //maybe system>?
          //preserver contexts
          //TODO: we need to preserve the original contexts for everything in hur

          // console.groupEnd()

        // }
      }
    }
  }
}
