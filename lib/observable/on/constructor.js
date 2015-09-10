"use strict";

var Base = require('../../base')
var Emitter = require('../../emitter')
var util = require('../../util')

var removeInternal = Base.prototype.$removeInternal
var On

On = module.exports = new Base({
  $key:'$on',
  $define: {
    $ChildConstructor: Emitter,
    $newParent: function( parent, event ) {
      if(this.$change && this.$change.$base) {
        //this can be better!
        //just means that base is not inherited
        //never need to resolve here since its on new parent
        //new parent as a thing!
        //maybe call this function within obs constructor?

        //at least make it injectable (the new parent part)
        parent.set( { $on:{$change:{} } }, false, true )
        //also be carefull here since it can be that context has to be resolved
        //also when context is not resolved should not fire
        parent.$on.$change.$removeProperty( parent.$on.$change.$base, '$base' )
      }
    },
    $generateConstructor: function() {
      return function DerivedOn( val, event, parent, key  ) {
        // var proto = Object.getPrototypeOf( this )
        if( parent ) {
          parent.$trackInstances = true
        }
        return Base.apply( this, arguments )
      }
    }
  },
  $flags: {
    $property: require('../../emitter/property'),
    $error: require('../../emitter/error'),
    $value: new Emitter({
      $define:{
        $postponed: false
      }
    }),
    $reference: new Emitter({
      $define:{
        $postponed: false
      }
    }),
    $new: new Emitter({
      $define:{
        $instances: false
      }
    }),
    $addToParent: new Emitter({
      $define:{
        //make no instance and exec postponed same...
        $postponed: false,
        $instances: false
      }
    })
  }
}).$Constructor
