'use strict'
var subscribe = require('../shared').subscribe

var getLateral = require('../info').getLateral
var findPattern = require('../find')

module.exports = function parent (data, event, emitter, pattern, info, mapvalue, map) {
  // TODO this resolves the context
  if(!getLateral(info) && !pattern._context){
    findPattern(this, mapvalue, [])
  }

  event.type = 'parent'

  data = {
    context: this,
    map: mapvalue
  }

  map[this.key] = mapvalue
  subscribe(emitter, data, event, this.parent, pattern, 'sub_parent', info, map)
    // should I remove the parent listener now? Perhaps keep it for the instances
}
