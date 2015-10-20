'use strict'
var incrementDepth = require('../info').incrementDepth

module.exports = function upward(data, event, emitter, pattern, info, mapvalue, map) {
  //test fix

  console.log('parrrrrrr')
  pattern = JSON.parse(JSON.stringify(pattern))
  map = {}
  map[this.key] = mapvalue

  emitter.upward({}, event, this.parent, pattern, incrementDepth(info), map, {})
    // should I remove the parent listener now? Perhaps keep it for the instances
}