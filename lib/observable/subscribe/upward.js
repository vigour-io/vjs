'use strict'
var onUpward = require('./on/upward')

exports.$define = {
  $subscribeUpward: function (obj, val, event, refLevel, level, meta, prevMap, map) {
    var fulfilled = this.$loopSubsObject(obj, val, event, refLevel, level, meta, prevMap)
    var parent
    if (!fulfilled) {
      parent = obj.$parent
      if (parent) {
        map[obj.$key] = prevMap
        return this.$subscribeUpward(parent, val, event, refLevel, level++, meta, map, {})
      }
      obj.on('$addToParent', [onUpward, this, refLevel, level, val, prevMap, {}])
      return true
    }
  }
}
