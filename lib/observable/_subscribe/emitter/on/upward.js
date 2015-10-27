'use strict'
var incrementDepth = require('../info').incrementDepth

module.exports = function upward(data, event, emitter, pattern, info, mapvalue, map) {
  //test fix

  // pattern = JSON.parse(JSON.stringify(pattern))
  // map = {}

  data = {
    context: this,
    map: mapvalue
  }

  map[this.key] = mapvalue

  emitter.upward(data, event, this.parent, pattern, incrementDepth(info), map, {})
    // should I remove the parent listener now? Perhaps keep it for the instances
}