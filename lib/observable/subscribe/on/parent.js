'use strict'
module.exports = function onParent ( event, meta, subsemitter, refLevel, level, val, prevMap, map ) {
  var parent = this.$parent
  map[this.$key] = prevMap
  subsemitter.$subscribeToProperty(parent, val, '$parent', event, refLevel, ++level, true, map)
}
