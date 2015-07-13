"use strict";

var Base = require('../index.js')
var proto = Base.prototype
var Emitter = require('./emitter')
var util = require('../../util')
var Event = require('./event')

//FIRST UPDATE FIX IT!

//lets split Base into Core + Base
//eventemitter, on are instances of Core
//rest Base is instance of Core
//$on extends on core
//.set is on core
//.$val is on base
//maybe not but now we need an extra check (strictType)

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

// Emitter.prototype.$setKey('$on', {
//   $new:function(event) {
//     this.$lastStamp = event.$stamp
//     console.error('hello log new emitter', event.$stamp, this.$path, this instanceof Emitter)
//   }
// })

