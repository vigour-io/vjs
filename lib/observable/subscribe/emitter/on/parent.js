'use strict'
var subscribe = require('../shared').subscribe

var getLateral = require('../info').getLateral
var findPattern = require('../find')

module.exports = function parent (data, event, emitter, pattern, info, mapvalue, map) {
  //test fix 
  // pattern = JSON.parse(JSON.stringify(pattern))
  // map = {}

  // TODO this resolves the context
  if(!getLateral(info) && !pattern._context){
    findPattern(this, mapvalue, [])
  }

  console.error('eventtype',event.type)

  event.type = 'parent'

  data = {
    context: this,
    map: mapvalue
  }

  map[this.key] = mapvalue
  subscribe(emitter, data, event, this.parent, pattern, 'parent', info, map)
    // should I remove the parent listener now? Perhaps keep it for the instances
}
