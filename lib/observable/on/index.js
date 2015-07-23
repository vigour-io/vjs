"use strict";

var Base = require('../../base')
var Emitter = require('../../emitter') 
var util = require('../../util')
var removeInternal = Base.prototype.$removeInternal

var On = new Base({
  $key:'$on',
  $define: {
    $removeInternal: function( event, nocontext ) {

      // console.log( 'im doing instances resolving --->', 
      //   'context:' , this._$context, 
      //   'path:', this.$path
      // )

      var fromProto = Object.getPrototypeOf(this)
      var instances = fromProto._instances
      if( instances ) {
        for( var i = 0, instance; (instance = instances[i]); i++ ) {
          if( instances[i] === this.$parent ) {
            instances.splice( i, 1 )
            i--
          }
        }
      }

      return removeInternal.call( this, event, nocontext )
    },
    $ChildConstructor: Emitter,
    $strictType: function( val ) {
      return (val instanceof Emitter)
    },
    $generateConstructor: function() {
      return (function On( val, event, parent, key ) {
        
        Base.call( this, val, event, parent, key )
        
        var instances = this._instances

        if(instances) {

          if(!this._$parent) {
            throw new Error( 'should have a parent - resolving instances in on' )
          }
          
          var Constructor = this._$parent._$Constructor
          var newInstances

          for( var i = 0, length = instances.length; i < length; i++ ) {
            var instance = instances[i]
            if( Constructor && (instance instanceof Constructor) ) {
              if(!newInstances) {
                newInstances = []
              }
              newInstances.push(instance)
              //remove it since the new constructor will become the handler
              this._instances.splice(i,1)
            }
          }
          this._instances = newInstances
        }

        // console.error('making new!', this.$path)

        var proto = Object.getPrototypeOf(this)

        //this check is wrong
        if( proto._$parent ) {
          if( !proto._instances ) {
            proto._instances = []
          }
          proto._instances.push( this._$parent )
        } else {
          // console.warn( 'i can have more instances... we dont store them now though', this.$path )
          //how are we ever going to solve this case without having instances info..
        }

      })
    },
    //this is dirty but not rly another way... on is not defined yet...
    //we can use this to emit newParent type at least
    $newParent: function( parent, event ) {

      if(this.$change && this.$change.$base) {
        parent.$set( { $on:{$change:{} } }, false, true )
        // parent.$on.$change.$clearContext() //should always be called on new
        //moet met removeProperty ofcourse
        //parent.$on.$change.$base = null
        parent.$on.$change.$removeProperty( parent.$on.$change.$base, '$base' )
      }

      if(!this._instances) {
        this._instances = [] 
      } 
      if(parent !== this._$parent) {
        this._instances.push( parent )
      }
      
    }
  },
  $flags: {
    $property: require('../../emitter/property'),
    $reference: require('../../emitter/reference')
  }
}).$Constructor

//-----------injectable part of the module----------

exports.$inject = require('./emit')

exports.$flags = {
  $on: On
}

exports.$define = {
  on: function( type, val, key, unique, event ) {
    if( typeof type !== 'string' ) {
      //move one to the left
      return this.on( '$change', type, val, key, unique )
    } else {
      //if !type use change listener
      if( !this.$on || !this.$on[type] ) {
        var set = { $on: {} }
        set.$on[type] = {}
        this.$set( set, event || false )
      }
     this.$on[type].$addListener( val, key, unique, event )
    }
  },
  //val||key
  removeListener: function( type, val, event ) {
    if( typeof type === 'string' ) {
      //emitter type
      if( !val ) {
        val = 'val'
      }

      if( !this.$on || !this.$on[type] ) {
        throw new Error('no $on or no ', type, 'emitter')
      }

      var emitter = this.$on[type]
      var context = emitter._$context

      if( typeof val === 'string' ) {
        console.log('removeListener on a key "'+val+'"')

        //this should go into emitter!

        var storageKey 

        if( emitter.$fn && emitter.$fn[val] ) {
          storageKey = '$fn'
        } else if( emitter.$base && emitter.$base[val] ) {
          storageKey = '$base'
        } else if( emitter.$passon && emitter.$passon[val] ) {
          storageKey = '$passon'
        }

        if( context ) {
          console.error( 'im a context boy!', this.$on.$path )
          var setObj = {}
          setObj[type] = {}
          this.$set( setObj )
          emitter = this.$on[type]
        }

        if(!emitter.hasOwnProperty( storageKey) ) {
          console.error('have to make new for', storageKey, this.$path)
          emitter.$setKey( storageKey, {}, false )
        }

        //creating a new emitter type... (lot of extra hassle>?)
        //maybe add something here???
        emitter[storageKey]
          .$removeProperty( emitter[storageKey][val], val )

      } else {
        console.log('removeListener on something else find it!')
      }
    } else {
      //same for on moves one the the left
      return this.removeListener( '$change', type, val )
    }
  }
}

