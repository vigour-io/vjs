"use strict";

var Base = require('../index.js')
var proto = Base.prototype
var Emitter = require('./emitter')
var util = require('../../util')
var Event = require('./event')

var On = module.exports = new Base({
  $key:'$on',
  $define: {
    $ChildConstructor: Emitter,
    $strictType: function(val) {
      return (val instanceof Emitter) || (val instanceof On)
    },
    $generateConstructor: function() {
      return (function On( val, event ) {

        Base.apply(this, arguments)

        if(this._instances) {
          this._instances = null
        }
        if((this.__proto__ !== Base.prototype)) {
          if(!this.__proto__._instances) {
            this.__proto__._instances = []
          }
          //???why does this break the simple case???
          this.__proto__._instances.push(this._$parent)
        }
        // console.error(this._$parent)
    
      })
    },
    //this is dirty but not rly another way... on is not defined yet...
    //we can use this to emit newParent type at least
    $newParent: function( parent ) {
      // console.log('hello!', parent.$toString(), this)
      //hier management doen voor instances :/
      //word vrij lastig

      if(!this._instances) {
        console.error('?', this)
        this._instances = [] 
        // this._instances.push(parent)
        //dit moet beter want moet worden weggegooid op nieuw ofcourse
      } 

    }
  },
  $flags: {
    $property: require('./emitter/property'),
    $reference: require('./emitter/reference'),
  }
}).$Constructor

//deze moet on new parent hebben...

//----binding it, replace with something else later---
proto.$flags = { $on: On }

Base.prototype.$define = {
  on: function( type, val, key, unique ) {
    console.group()
    console.log('\n\nHEY ITS FUN!', this.$path, val.$path)

    if(val._$key !== '$on' && this._$key !== '$on') {

      console.log('PASSED')

      if(!this.$on || !this.$on[type]) {
        var set = { $on: {} }
        set.$on[type] = {}

        this.$set(set, false)
        console.log('make it!',this,  this.$on[type], this.$on, set)
      }
      console.log(this.$on, this.$path, val,  this.$on[type], type)
      this.$on[type].$addListener( val, key, unique )

    }
    console.error('DONE')
    console.groupEnd()
  }
}

//on new base what to do with the listens array???
//create a new one?
//handle it like an object?
