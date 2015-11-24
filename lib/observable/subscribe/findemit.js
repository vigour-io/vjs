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
        } else {
          // mapvalue[i] = null
        }
      }
    }
  },

  findResubscribe (data, event, obs, pattern, mapvalue) {
    if (typeof mapvalue !== 'object') {
      if (obs._input !== null) {
        console.error('resubcribing:',obs.path)
        this.subField(data, event, obs, obs.pattern, 0, true)
      }
    } else {
      for (let i in mapvalue) {
        let property = obs[i]
        if (property) {
          this.findResubscribe(data, event, property, pattern.parent, mapvalue[i])
        }
      }
    }
  },

  findResubscribeProp (data, event, obs, pattern, current, mapvalue) {
    if (obs._input !== null) {
      this.subField(data, event, obs, pattern, current, mapvalue)
    } else {
      for (let i in mapvalue) {
        let property = obs[i]
        if (property) {
          this.findResubscribeProp(data, event, property, pattern.parent, current, mapvalue[i])
        }
      }
    }
  }
}
