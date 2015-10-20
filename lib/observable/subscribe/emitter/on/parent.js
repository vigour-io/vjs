'use strict'
var subscribe = require('../shared').subscribe

module.exports = function parent (data, event, emitter, pattern, info, mapvalue, map) {

  console.log('event',event)
  console.log('event',event.origin)

  //test fix
  pattern = JSON.parse(JSON.stringify(pattern))
  map = {}

  console.log('pattern', pattern)
  console.log('context', this._context)
  console.log('parent', this.parent)

  map[this.key] = mapvalue

  var fulfilled = subscribe(emitter, {}, event, this.parent, pattern, 'parent', info, map)

  console.error('pattern returned!',fulfilled)
    // should I remove the parent listener now? Perhaps keep it for the instances
}
