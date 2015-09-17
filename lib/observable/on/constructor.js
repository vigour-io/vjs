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
        parent.set( { $on:{$change:{} } }, false, true )
        parent.$on.$change.$removeProperty( parent.$on.$change.$base, '$base' )
      }
    },
    $generateConstructor: function() {
      return function DerivedOn( val, event, parent, key  ) {
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
    $addToParent: new Emitter(),
    $change: new Emitter()
  }
}).$Constructor
