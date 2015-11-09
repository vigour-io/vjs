'use strict'
var resolvePattern = function () {}

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    resolvePattern(this, map)
    map[this.key] = mapvalue

    // do something with context resolvement
    // var resolver = {
    //   enpoint: this,
    //   map: mapvalue
    // }
    emitter.subField({}, event, this.parent, pattern.sub_parent, current, map, {})
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    // I don't think this can resolve the pattern
    // pattern = resolvePattern(this, mapvalue)
    map[this.key] = mapvalue
    emitter.subFieldRef({}, event, this.parent, pattern.sub_parent, current, map, {}, context)
  }
}
