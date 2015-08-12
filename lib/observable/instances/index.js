"use strict";
exports.$inject = require('../../methods/lookUp')

exports.$flags = {
  $trackInstances: function( val ) {
    this.$trackInstances = val
  }
}

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
    if( !emitter.$noInstances ) {
      var instances = this.hasOwnProperty( '_$instances' ) && this._$instances
      var instance
      var parent
      var path
      var property
      // var _property
      //optimize this ! e.g. remove removes all instances dont add instances for instances

      if( !this.hasOwnProperty( '_$instanceStamp' ) || this._$instanceStamp !== event.$stamp ) {

        this._$instanceStamp = event.$stamp

        //fine for change not fine for custum stuff where you want to emit on instances of instance with a context
        if( instances ) {
          console.log('i have instances but mos def some contexts as well..')
          for( var i = 0, length = instances.length; i < length; i++ ) {
            instance = instances[i]
            instance.$emit.apply( instance, args )
          }
        }

        if( ( parent = this._$parent ) && !this._$context ){

          //pure horror --- how to figure out to do this?

          //sometimes it needs to be ignored sometimes it should not be ignored :/

          //now this case this._$context this is not correct!

          //this is only testable by not setting but emitting emitters

          //update on a virtual thing within instances -- what to do?


          //!context is ofcourse wrong
          path = [this.$key]

          console.error( 'hey trying this in instances?', this.$key, path )

          var orig
          while(parent){
            if( parent.hasOwnProperty('_$instances') ){
              orig = parent
              instances = parent._$instances
              break
            }
            path.push( parent.$key )
            parent = parent._$parent
          }

          if (instances ) {
            for( var i = 0, length = instances.length; i < length; i++ ) {
              instance = instances[i]
              for ( var j = path.length - 1; j >= 0; j-- ) {
                property = path[j]
                instance = instance[ property ]
                // instance.$
                // console.log('?--->', instance.$path)
              }
              if(instance){
                // console.group()
                // console.info('lets emit it instance!', instance.$path, event.$context)
                instance.$emit.apply( instance, args )

                // instance = instances[i]
                // instance.$clearContext()

                //instance.$emit.on end kunnen doen
              }
            }

          }

          // instance = orig
          // // console.log(' -- now try to clear it', instance.$path)
          //
          // for ( var j = path.length - 1; j >= 0; j-- ) {
          //   property = path[j]
          //   console.log( j, property, path, instance && instance.$path,
          //     instance && Object.getPrototypeOf(instance).$key
          //   )
          //   if( instance ) {
          //     // console.log('wtf', property, Object.getPrototypeOf(instance)[property] )
          //     // console.log('wtf2', property, window.ghello.a , '\n\n', window.ghello.a === Object.getPrototypeOf(instance) )
          //
          //     // console.log('wtf3', window.ghello.a[property])
          //     instance =  instance[ property ]
          //
          //
          //     // throw(new Error('so wrong...'))
          //
          //   }
          //   if(instance) {
          //     if(instance) {
          //       console.log('hey instance', this.$path)
          //
          //       instance.$clearContext()
          //     }
          //   }
          // }
          // console.groupEnd()
        }
      }
    }
  }
}
