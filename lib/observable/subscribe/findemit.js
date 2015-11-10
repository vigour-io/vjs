'use strict'
exports.define = {
  findEmit (data, event, obs, mapvalue, map, noinstances, key) {
    if (typeof mapvalue !== 'object') {
      if (mapvalue === true) {
        console.log('!!!!!')
        this.emit(data, event, obs)
        if (map) {
          map[key] = 1
        } else {
          console.warn('no map, do that thing with the endpoint field')
        }
      } else if (!noinstances) {
        console.log('????')
        this.emit(data, event, obs)
      }
    } else {
      for (let i in mapvalue) {
        let property = obs[i]
        console.log('---->',property)
        if (property) {
          this.findEmit(data, event, property, mapvalue[i], mapvalue, noinstances, i)
        }
      }
    }
  }
}
