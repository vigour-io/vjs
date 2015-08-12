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
    if(cnt> 200) {
      //easier for debugging
      throw new Error('too much emitInstances')
    }
    if( !emitter.$noInstances ) {
      var instances = this.hasOwnProperty( '_$instances' ) && this._$instances
      var instance
      var parent
      var path
      var property

      if( !this.hasOwnProperty( '_$instanceStamp' ) || this._$instanceStamp !== event.$stamp ) {

        this._$instanceStamp = event.$stamp //combi with context

        //fine for change not fine for custum stuff where you want to emit on instances of instance with a context

        if( instances && !this._$context ) {
          //dont do this when context, but may do context when instances
          console.log('i have instances but mos def not contexts as well..')
          for( var i = 0, length = instances.length; i < length; i++ ) {
            instance = instances[i]
            instance.$emit.apply( instance, args )
          }
        }

        if( ( parent = this.$parent ) ) {

          //pure horror --- how to figure out to do this?
          //sometimes it needs to be ignored sometimes it should not be ignored :/
          //now this case this._$context this is not correct!
          //this is only testable by not setting but emitting emitters
          //update on a virtual thing within instances -- what to do?
          // this._$instanceStamp
          //!context is ofcourse wrong

          path = [this.$key] //wel ff deze erbij

          console.group()

          console.info( '\ndoing emits', '\noriginal', this._$path, '\ncontextPath:', this.$path, '\n\n' )
          console.log(
            '\nhas context:', !!this._$context
          , '\nparent orig path:', parent._$path
          , '\nthis orig path:', this._$path
          , '\nparent context path:', parent.$path
          , '\nthis context path:', this.$path
          , '\nfrom -- if empty is obs:' , Object.getPrototypeOf( this )._$path
          )

          var lcontext
          var orig

          if(!this.hasOwnProperty('_$lcontext')) {
            console.log('%c_$lcontext set', 'font-weight:bold;color:blue;')
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
              console.log(
                '\nparent loop - found instances for:', orig.$path,
                '\ngenerated path:', path
              )
              instances = parent._$instances
              break
            }
            path.push( parent.$key )
            parent = parent.$parent

          }

          if (instances ) {
            for( var i = 0, length = instances.length; i < length; i++ ) {
              instance = instances[i]
              for ( var j = path.length - 1; j >= 0; j-- ) {
                property = path[j]
                instance = instance[ property ]
              }
              if(instance){
                console.warn('\nnew emit for :', instance.$path )
                instance.$emit.apply( instance, args )

              }
            }
          }

          if( lcontext && this._$lcontext !== true ) {
            console.error('reset my lcontext', this._$path, this._$lcontext._$path, this._$llevel)
            //for each in context change it pack
            this._$context = this._$lcontext
            this._$contextLevel = this._$llevel
            this._$context.$resetContextsUp()

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

          console.groupEnd()

        }
      }
    }
  }
}
