'use strict'
exports.define = {
  findEmit (data, event, obs, mapvalue, map, noinstances, key) {
    if (typeof mapvalue !== 'object') {
      if (mapvalue === true) {
        this.emit(data, event, obs)
        if (map) map[key] = 1
      } else if (!noinstances) {
        this.emit(data, event, obs)
      }
    } else {
      for (let i in mapvalue) {
        let property = obs[i]
        if (property) {
          this.findEmit(data, event, property, mapvalue[i], mapvalue, noinstances, i)
        }
      }
    }
  },

  findResubscribe (data, event, obs, mapvalue, map, noinstances, key) {
    if (typeof mapvalue !== 'object') {
      if (obs._input !== null) {
        this.subField(data, event, obs, obs.pattern, 0, true, this._map)
        // this.emit(data, event, obs)
      }
    } else {
      for (let i in mapvalue) {
        let property = obs[i]
        if (property) {
          this.findResubscribe(data, event, property, mapvalue[i], mapvalue, noinstances, i)
        }
      }
    }
  }
}
