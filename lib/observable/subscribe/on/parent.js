'use strict'
var getLateral = require('../info').getLateral
var getPattern = require('../util/pattern')

module.exports = function onParent (data, event, emitter, pattern, info, mapValue, mapObj) {
  event.type = 'parent'

  if (!getLateral(info) && !pattern._context) {
    pattern = getPattern(this, mapValue, [])
  }

  mapObj[this.key] = mapValue
  emitter.subscribeField({
    fromParent: true
  }, event, this.parent, pattern, 'parent', info, mapObj)
    // should I remove the parent listener now? Perhaps keep it for the instances
}
