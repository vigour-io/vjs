'use strict'
var incrementDepth = require('./info').getDepth
var onUpward = require('./on').upward

module.exports = function (event, meta, obj, pattern, info, map, mapvalue) {
  var fulfilled = this.subscribe(event, meta, obj, pattern, info, map, mapvalue)
  var parent
  if (!fulfilled) {
    info = incrementDepth(info)
    parent = obj.parent
    if (parent) {
      map[obj.key] = mapvalue
      return this.upward(event, meta, obj, pattern, info, map, {})
    }
    obj.on('addToParent', [onUpward, this, pattern, info, map, mapvalue || {}])
    return true
  }
}
