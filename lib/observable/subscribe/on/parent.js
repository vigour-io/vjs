'use strict'
// var getLateral = require('../info').getLateral
// var findPattern = require('../find')

module.exports = function onParent (data, event, emitter, pattern, info, mapValue, mapObj) {
  // TODO this resolves the context
  // if(!getLateral(info) && !pattern._context){
  //   findPattern(this, mapValue, [])
  // }

  event.type = 'parent'

  data = {
    context: this,
    mapObj: mapValue
  }

  mapObj[this.key] = mapValue
  emitter.subscribeField(data, event, this.parent, pattern, 'parent', info, mapObj)
  // should I remove the parent listener now? Perhaps keep it for the instances
}
