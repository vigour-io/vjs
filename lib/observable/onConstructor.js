// onConstructor.js
var Base = require('../base')
var Emitter = require('../emitter')
var util = require('../util')
var removeInternal = Base.prototype.$removeInternal

var On = module.exports = new Base({
  $key:'$on',
  $define: {
    $removeInternal: function( event, nocontext ) {
      var fromProto = Object.getPrototypeOf(this)
      var instances = fromProto._instances
      if( instances ) {
        for( var i = 0, instance; (instance = instances[i]); i++ ) {
          //dont have to keep looping
          if( instances[i] === this.$parent ) {
            instances.splice( i, 1 )
            break;
            // i--
          }
        }
      }
      return removeInternal.call( this, event, nocontext )
    },
    $ChildConstructor: Emitter,
    // $strictType: function( val ) {
    //   return (val instanceof Emitter)
    // },
    $generateConstructor: function() {
      return (function On( val, event, parent, key ) {

        Base.call( this, val, event, parent, key )

        //these are instances of observavles that have this .$on as a property
        var instances = this._instances

        if( instances ) {

          if( !this._$parent ) {
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

        var proto = Object.getPrototypeOf(this)

        if( proto._$parent ) {
          if( !proto._instances ) {
            proto._instances = []
          }
          proto._instances.push( this._$parent )
        }
      })
    },
    $newParent: function( parent, event ) {
      if(this.$change && this.$change.$base) {
        parent.set( { $on:{$change:{} } }, false, true )
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
    $property: require('../emitter/property'),
    $value: new Emitter({
      $define:{
        $executePostponed:false
      }
    }),
    $reference: new Emitter({
      $define:{
        $executePostponed:false
      }
    }),
    $new: new Emitter({
      $define:{
        $noInstances:true
      }
    }),
    $addToParent: new Emitter({
      $define:{
        //make no instance and exec postponed same...
        $executePostponed:false,
        $noInstances:true
      }
    })
  }
}).$Constructor
