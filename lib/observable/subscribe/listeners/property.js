'use strict'
var resolvePattern = function () {}

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    var added = data.added
    console.log('----prop')
    if (added) {
      let found
      for (let i = added.length - 1; i >= 0; i--) {
        let key = added[i]
        let field = pattern[key]
        if (field) {
          if (!found) {
            // do something with context resolvement
            // var resolver = {
            //   enpoint: this,
            //   map: mapvalue
            // }
            resolvePattern(this, mapvalue)
            found = true
          }
          map.parent = mapvalue
          emitter.subField(data, event, this[key], field, current, mapvalue, map)
        }
      }

      if (found) {
        // check if the listener can be removed
        // If all properties in the pattern have been found with no referenceDistance,
        // on the original subscriber
      }
    }
  },
  reference (data, event, emitter, pattern, current, mapvalue, map) {
    var added = data.added
    if (added) {
      let found
      for (let i = added.length - 1; i >= 0; i--) {
        let key = added[i]
        let field = pattern[key]
        if (field) {
          // can't resolve the pattern?
          map.parent = mapvalue
          emitter.subFieldRef(data, event, this[key], field, current, map)
        }
      }

      if (found) {
        // check if the listener can be removed
        // If all properties in the pattern have been found on this referenceDistance or lower,
        // on the original subscriber
      }
    }
  }
}
