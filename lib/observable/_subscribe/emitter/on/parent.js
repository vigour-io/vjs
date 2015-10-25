'use strict'
var subscribe = require('../shared').subscribe

module.exports = function parent (data, event, emitter, pattern, info, mapvalue, map) {
  //test fix 
  pattern = JSON.parse(JSON.stringify(pattern))
  map = {}

  data = {
    context: this,
    map: mapvalue
  }

  map[this.key] = mapvalue
  subscribe(emitter, data, event, this.parent, pattern, 'parent', info, map)
    // should I remove the parent listener now? Perhaps keep it for the instances
}
