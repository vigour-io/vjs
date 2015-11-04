'use strict'
var incDepth = require('../info').incDepth
var getPattern = require('../util/pattern')

module.exports = function onUpward (data, event, emitter, pattern, info, mapValue, mapObj) {
  event.type = 'parent'
  mapObj[this.key] = mapValue
 	// pattern = getPattern(this, pattern, info, mapValue)
  emitter.subscribeUpward({}, event, this.parent, pattern, incDepth(info), mapObj, {})
}
