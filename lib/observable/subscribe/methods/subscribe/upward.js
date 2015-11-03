'use strict'
var onUpward = require('../../on/upward')

module.exports = function subscribeUpward (data, event, obj, pattern, info, mapValue, mapObj) {
  var fulfilled = this.subscribeObject(data, event, obj, pattern, info, mapValue, mapObj)
  if (fulfilled) {
    return fulfilled
  }
  let parent = obj.parent
  if (parent) {
    mapObj[obj.key] = mapValue
    return this.subscribeUpward(data, event, parent, pattern, info, mapObj, {})
  }
  obj.on('parent', [onUpward, this, pattern, info, mapValue, mapObj])
}
