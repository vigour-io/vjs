'use strict'
var getPattern = require('../util/pattern')

module.exports = function onParent (data, event, emitter, pattern, info, mapValue, mapObj) {
  event.type = 'parent'
  pattern = getPattern(this, pattern, info, mapValue)
  mapObj[this.key] = mapValue
  emitter.subscribeField({}, event, this.parent, pattern, 'parent', info, mapObj)
    // should I remove the parent listener now? Perhaps keep it for the instances
}
