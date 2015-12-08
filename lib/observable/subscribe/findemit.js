'use strict'

exports.define = {
  findEmit (data, event, obs, mapvalue, map, noinstances, key) {
    if (typeof mapvalue !== 'object') {
      if (mapvalue === true) {
        this.emit(data, event, obs)
        if (map) {
          map[key] = 1
        }
      } else if (!noinstances) {
        this.emit(data, event, obs)
      }
    } else {
      // console.log('loop:', obs.path)
      for (let i in mapvalue) {
        // console.log('i:',i)
        let property = i === 'val' ? obs : obs[i]
        if (property) {
          // console.log('emitting:', obs.path, obs[i].path)
          this.findEmit(data, event, property, mapvalue[i], mapvalue, noinstances, i)
        }
      }
    }
  },

  findEmitInstances (data, event, obs, mapvalue, map, key) {
    let instances = obs._instances
    if (instances) {
      for (let i = instances.length - 1; i >= 0; i--) {
        if (instances[i] !== obs) {
          this.findEmitInstances(data, event, instances[i], mapvalue, map, key)
        }
      }
    }
    if (typeof mapvalue !== 'object') {
      this.emit(data, event, obs)
      if (map) map[key] = 1
    } else {
      for (let i in mapvalue) {
        let property = i === 'val' ? obs : obs[i]
        if (property) {
          this.findEmitInstances(data, event, property, mapvalue[i], mapvalue, i)
        }
      }
    }
  },

  findEmitContext (data, event, obs, mapvalue) {
    let instances = obs._instances
    if (instances) {
      for (let i = instances.length - 1; i >= 0; i--) {
        if (instances[i] !== obs && instances[i]._input === obs._input) {
          this.findEmitContext(data, event, instances[i], mapvalue)
        }
      }
    }
    this.findEmit(data, event, obs, mapvalue)
  },

  resub (data, event, obs, mapvalue) {
    if (typeof mapvalue !== 'object') {
      if (obs._input !== null) {
        this.subField(data, event, obs, obs._on[this.key].pattern, 0, true)
      }
    } else {
      for (let i in mapvalue) {
        let property = i === 'val' ? obs : obs[i]
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
        let property = i === 'val' ? obs : obs[i]
        if (property) {
          this.resubPartial(data, event, property, pattern.parent, current, mapvalue[i])
        }
      }
    }
  }
}
