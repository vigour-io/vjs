'use strict'
var subscribe = require('../shared').subscribe

module.exports = function onAny (data, event, emitter, pattern, info, mapvalue, map) {
  var added = data && data.added
  var key
  var i
  if (added) {
    map.parent = mapvalue
    for (i = added.length - 1; i >= 0; i--) {
      key = added[i]
      subscribe(emitter, data, event, this[key], pattern, key, info, map)
    }
  }
}
