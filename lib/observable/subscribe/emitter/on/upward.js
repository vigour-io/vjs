'use strict'
var incrementDepth = require('../info').incrementDepth

module.exports = function upward (data, event, emitter, pattern, info, mapvalue, map, originalPattern) {
  
  //test fix
  if (originalPattern) {
    pattern = JSON.parse(JSON.stringify(originalPattern))
  } else {
    this._on.parentEmitter.attach.each((prop) => {
    	if(prop[1] === emitter){
    		prop[2][5] = pattern
    	}
    })
  }

  map = {}

  map[this.key] = mapvalue

  emitter.upward({}, event, this.parent, pattern, incrementDepth(info), map, {})
	// should I remove the parent listener now? Perhaps keep it for the instances
}
