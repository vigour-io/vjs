'use strict'
exports.define = {
  findEmit (data, event, obs, mapvalue, map, noinstances, key) {
    console.log('???', map, mapvalue, key, obs)
    if (typeof mapvalue !== 'object') {
      if (mapvalue === true) {
        this.emit(data, event, obs)
        if(map){
          map[key] = 1
        }else{
          console.warn('no map, do that thing with the endpoint field')
        }
      } else if (!noinstances) {
        this.emit(data, event, obs)
      }
    } else {
      console.log('gogogo')
      for (let i in mapvalue) {
        let property = obs[i]
        console.log('prop',property,obs, obs.c, i)
        if (property) {
          this.findEmit(data, event, property, mapvalue[i], mapvalue, noinstances, i)
        }
      }
    }
  },
  findEmitRef (data, event, obs, mapvalue, map, context, contextmapvalue) {
    // what to do?
    console.error('data', data,context, contextmapvalue)
  }
}
