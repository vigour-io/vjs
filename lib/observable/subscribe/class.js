// onConstructor.js
var Base = require('../../base')
var Emitter = require('../../emitter')
var util = require('../../util')
var removeInternal = Base.prototype.$removeInternal
var On = require('../on/class')

var MetaEmitter = require('../on/metaemitter')

var SubsEmitter = require('./emitter')

// var SubscriptionEmitter = new Emitter({
//   $define: {
//     $postpone: function( bind, event ) {

//       if( !event ) {
//         throw new Error( '$postpone does not have event! (emitter)' )
//         return
//       }

//       if( 
//         this.$pushBind( bind, event )
//       ) {        
//         if( 
//           //instances zijn special ofcourse
//           !this.hasOwnProperty( '$isPostponed' ) || 
//           !this.$isPostponed
//         ) {
//           event.$metaPostpone( this )
//           this.$isPostponed = true
//         }
//       }

//     }
//   }
// })

var set = On.prototype.$set

var Subscriptions = module.exports = new On({
  $key: '$subscriptions',
  $define: {
    // <<<<<<<<<< TEMP FIX
    $set: function(val, event) {
      console.warn( 'extended set!', val )

      var result = set.apply(this, arguments)
      console.log( 'result!', result )

      for(var k in val) {
        var added = this[k]
        if(added.$on && added.$on.$newParent) {
          console.log('!!!!!!!!!! yes', added.$on.$newParent)

          added.$on.$newParent(this, event)
        }
      }

      return result
    },
    // <<<<<<<<<<  /TEMP FIX
    $removeInternal: function( event, nocontext ) {



      // var fromProto = Object.getPrototypeOf(this)
      // var instances = fromProto._instances
      // if( instances ) {
      //   for( var i = 0, instance; (instance = instances[i]); i++ ) {
      //     if( instances[i] === this.$parent ) {
      //       instances.splice( i, 1 )
      //       i--
      //     }
      //   }
      // }
      // return removeInternal.call( this, event, nocontext )
    },
    $ChildConstructor: SubsEmitter,
    $strictType: function( val ) {
      return (val instanceof Emitter)
    },
    $generateConstructor: function() {
      return function On( val, event, parent, key ) {
        
        Base.call( this, val, event, parent, key )
        

        // var instances = this._instances

        // if(instances) {

        //   if(!this._$parent) {
        //     throw new Error( 'should have a parent - resolving instances in on' )
        //   }
          
        //   var Constructor = this._$parent._$Constructor
        //   var newInstances

        //   for( var i = 0, length = instances.length; i < length; i++ ) {
        //     var instance = instances[i]
        //     if( Constructor && (instance instanceof Constructor) ) {
        //       if(!newInstances) {
        //         newInstances = []
        //       }
        //       newInstances.push(instance)
        //       //remove it since the new constructor will become the handler
        //       this._instances.splice(i,1)
        //     }
        //   }
        //   this._instances = newInstances
        // }

        // var proto = Object.getPrototypeOf(this)

        // if( proto._$parent ) {
        //   if( !proto._instances ) {
        //     proto._instances = []
        //   }
        //   proto._instances.push( this._$parent )
        // }


      }
    },
    $newParent: function( parent, event ) {
      console.error('?!?!?!?!')
      // if(this.$change && this.$change.$base) {
      //   parent.$set( { $on:{$change:{} } }, false, true )
      //   parent.$on.$change.$removeProperty( parent.$on.$change.$base, '$base' )
      // }
      // if(!this._instances) {
      //   this._instances = [] 
      // } 
      // if(parent !== this._$parent) {
      //   this._instances.push( parent )
      // }
    }
  },
  $flags: {
    //remove flags of inject op nieuwe on
    // put one here? or just have change? 
  }
}).$Constructor


/*

var bla = new obj({
  $subscription: {
     $change: {
        MARCUS: fn, passon, base
     }
  }
})

//new subscription emitter
//internal listeners hangen
// call _subscribe -- subscriptionEmitter


// in de _subscribe


// hang $change / $property etc normal events
// when they fire:
// cache info about normal events in subscriptionEmitter._$meta
// then subscriptionEmitter.$emit( bind, event )




// 







*/

