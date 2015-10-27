'use strict'
var incDepth = require('../info').incDepth

module.exports = function onUpward(data, event, emitter, pattern, info, mapvalue, map) {
  //test fix

  // pattern = JSON.parse(JSON.stringify(pattern))
  // map = {}

  data = {
    context: this,
    map: mapvalue
  }

  map[this.key] = mapvalue

  emitter.upward(data, event, this.parent, pattern, incDepth(info), map, {})
    // should I remove the parent listener now? Perhaps keep it for the instances
}