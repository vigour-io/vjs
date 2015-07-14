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
    }
  },
  $flags: {
    $property: require('./emitter/property'),
    $reference: require('./emitter/reference')
  }
}).$Constructor

//----binding it, replace with something else later---
proto.$flags = { $on: On }

Base.prototype.$define = {
  on: function( type, val, key ) {
    if(!this.$on || !this.$on[type]) {
      var set = { $on: {} }
      set.$on[type] = {}
      this.$set(set, false)
    }
    this.$on[type].$addListener( val, key )
  }
}

//on new base what to do with the listens array???
//create a new one?
//handle it like an object?
