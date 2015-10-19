'use strict'
var onUpward = require('./on/upward')

module.exports = function (data, event, obj, pattern, info, mapvalue, map) {
  var fulfilled = this.subscribe(data, event, obj, pattern, info, mapvalue, map)
  var parent
  if (!fulfilled) {
    parent = obj.parent
    if (parent) {
      map[obj.key] = mapvalue
      return this.upward(data, event, parent, pattern, info, map, {})
    }
    obj.on('parent', [onUpward, this, pattern, info, mapvalue, map || {}])
    return true
  }
}
