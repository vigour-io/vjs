'use strict'
var incrementDepth = require('./info').getDepth
var onUpward = require('./on').upward

module.exports = function (event, meta, obj, pattern, info, mapvalue, map) {
  var fulfilled = this.subscribe(event, meta, obj, pattern, info, mapvalue, map)
  var parent
  if (!fulfilled) {
    info = incrementDepth(info)
    parent = obj.parent
    if (parent) {
      map[obj.key] = mapvalue
      return this.upward(event, meta, obj, pattern, info, map, {})
    }
    obj.on('addToParent', [onUpward, this, pattern, info, mapvalue, map || {}])
    return true
  }
}
