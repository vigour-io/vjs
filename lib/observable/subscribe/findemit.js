'use strict'
exports.define = {
  findEmit (data, event, obs, mapvalue, map, noinstances, key) {
    if (typeof mapvalue !== 'object') {
      this.emit(data, event, obs)
    } else {
      for (let i in mapvalue) {
        let property = i === 'val' ? obs : obs[i]
        if (property) {
          this.findEmit(data, event, property, mapvalue[i], mapvalue, noinstances, i)
        } else {
          delete mapvalue[i]
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
    } else {
      for (let i in mapvalue) {
        let property = i === 'val' ? obs : obs[i]
        if (property) {
          this.findEmitInstances(data, event, property, mapvalue[i], mapvalue, i)
        } else {
          delete mapvalue[i]
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
        this.subField(data, event, obs, obs._on[this.key].pattern, 0, { val:true })
      }
    } else {
      for (let i in mapvalue) {
        let property = i === 'val' ? obs : obs[i]
        if (property) {
          this.resub(data, event, property, mapvalue[i])
        } else {
          delete mapvalue[i]
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
        } else {
          delete mapvalue[i]
        }
      }
    }
  }
}
