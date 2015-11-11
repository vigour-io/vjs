'use strict'
var incDepth = require('../current/inc/depth')
var resolvePattern = require('../resolve')

module.exports = {
  direct (data, event, emitter, pattern, current, mapvalue, map) {
    console.log('>>',event.type)
    // do something with context resolvement
    // var resolver = {
    //   enpoint: this,
    //   map: mapvalue
    // }
    // console.log('upwardlistener', this.key, JSON.stringify(mapvalue, false, 2), this)
    map[this.key] = mapvalue
    resolvePattern(this, map)
    emitter.subUp({}, event, this.parent, pattern, incDepth(current), map, {})
  },
  reference (data, event, emitter, pattern, current, mapvalue, map, context) {
    map[this.key] = mapvalue
    console.log(JSON.stringify(mapvalue,false,2))
    emitter.subUpRef({}, event, this.parent, pattern, incDepth(current), map, {}, context)
  }
}
