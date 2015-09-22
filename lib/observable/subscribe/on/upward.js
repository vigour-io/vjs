'use strict'
module.exports = function onUpward (event, meta, subsemitter, refLevel, level, val, prevMap, map) {
  var parent = this.$parent
  map[this.$key] = prevMap
  // TODO: I can fire the change here (only if fulfilled)!
  subsemitter.$subscribeUpward(parent, val, event, refLevel, level + 1, true, map)
}
