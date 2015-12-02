'use strict'
exports.define = {
  findEmit (data, event, obs, mapvalue, map, noinstances, key) {
    if (typeof mapvalue !== 'object') {
      console.log('EMIT!!',mapvalue, obs.path, key, obs)
      if (mapvalue === true) {
        // obs.emit(this.key, data, event)
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

  resub (data, event, obs, mapvalue) {
    if (typeof mapvalue !== 'object') {
      if (obs._input !== null) {
        this.subField(data, event, obs, obs._on[this.key].pattern, 0, true)
      }
    } else {
      for (let i in mapvalue) {
        let property = obs[i]
        if (property) {
          this.resub(data, event, property, mapvalue[i])
        }
      }
    }
  },

  resubPartial (data, event, obs, pattern, current, mapvalue) {
    if (obs._input !== null) {
      this.subField(data, event, obs, pattern, current, mapvalue)
    } else {
      for (let i in mapvalue) {
        let property = obs[i]
        if (property) {
          this.resubPartial(data, event, property, pattern.parent, current, mapvalue[i])
        }
      }
    }
  }
}
