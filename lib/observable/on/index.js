"use strict";

var Base = require('../../base')
var Emitter = require('../../emitter') 
var util = require('../../util')

var On = new Base({
  $key:'$on',
  $define: {
    $ChildConstructor: Emitter,
    $strictType: function(val) {
      return (val instanceof Emitter)
    },
    $generateConstructor: function() {
      return (function On( val, event ) {
        Base.apply(this, arguments)
        if(this._instances) {
          this._instances = null
        }
        var proto = this.__proto__
        if(proto !== Base.prototype) {
          if(!proto._instances) {
            proto._instances = []
          }
          proto._instances.push(this._$parent)
        }
      })
    },
    //this is dirty but not rly another way... on is not defined yet...
    //we can use this to emit newParent type at least
    $newParent: function( parent ) {
      if(!this._instances) {
        this._instances = [] 
        //dit is helemaal wrong...mysterisouly word instance van zichzelf geadd?
        this._instances.push(parent)
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
  on: function( type, val, key, unique ) {
    // console.group()
    // console.log('\n\nHEY ITS FUN!', this.$path, val.$path)

    if(val._$key !== '$on' && this._$key !== '$on') {

      // console.log('PASSED')

      if(!this.$on || !this.$on[type]) {
        var set = { $on: {} }
        set.$on[type] = {}

        this.$set(set, false)
        // console.log('make it!',this,  this.$on[type], this.$on, set)
      }
      // console.log(this.$on, this.$path, val,  this.$on[type], type)
      this.$on[type].$addListener( val, key, unique )

    }
    // console.error('DONE')
    console.groupEnd()
  }
}

