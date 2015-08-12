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
      throw new Error('too much emitInstances')
    }
    if( !emitter.$noInstances ) {
      var instances = this.hasOwnProperty( '_$instances' ) && this._$instances
      var instance
      var parent
      var path
      var property

      // console.warn(
      //   'hey trying this in instances2222?'
      // , this._$context
      //
      // )
      // var _property
      //optimize this ! e.g. remove removes all instances dont add instances for instances

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

        //&& !this._$context this is what its all about...

        //&& !this._$context

        //do this smarter!
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

          var orig
          while(parent){
            // console.log('make it path', parent.$key)
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

          //TODO: we need to preserve the original contexts for everything in hur

          console.groupEnd()

        }
      }
    }
  }
}
