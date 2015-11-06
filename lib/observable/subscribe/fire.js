'use strict'
exports.define = {
  findEmit (data, event, obs, mapvalue, map, noinstances, key) {
    if (typeof mapvalue !== 'object') {
      if (mapvalue === true) {
        this.emit(data, event, obs)
        map[key] = 1
      } else if (!noinstances) {
        this.emit(data, event, obs)
      }
    } else {
      for (let i in mapvalue) {
        this.findEmit(data, event, obs, mapvalue[i], mapvalue, noinstances, i)
      }
    }
  },
  findEmitRef (data, event, obs, mapvalue, map) {
    // what to do?

  }
}
