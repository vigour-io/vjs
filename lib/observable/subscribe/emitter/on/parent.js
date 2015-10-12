'use strict'
var subscribe = require('../shared').subscribe

module.exports = function parent (data, event, emitter, pattern, info, mapvalue, map) {
  map[this.key] = mapvalue
  subscribe(emitter, {}, event, this.parent, pattern, 'parent', info, map)
// should I remove the parent listener now? Perhaps keep it for the instances
}
