'use strict'
module.exports = function upward (data, event, emitter, pattern, info, mapvalue, map) {
  map[this.key] = mapvalue
  emitter.upward({}, event, this.parent, pattern, info, map, {})
// should I remove the parent listener now? Perhaps keep it for the instances
}
