'use strict'
exports.define = {

  findEmit (data, event, obs, mapvalue) {
    if (mapvalue === true) {
      this.emit(data, event, obs)
    } else {
      for (let i in mapvalue) {
        let property = i === 'val' ? obs : obs[i]
        if (property) {
          this.findEmit(data, event, property, mapvalue[i])
        }
      }
    }
  },

  findEmitInstances (data, event, obs, mapvalue) {
    let instances = obs._instances
    if (instances) {
      for (let i = instances.length - 1; i >= 0; i--) {
        if (instances[i] !== obs) {
          this.findEmitInstances(data, event, instances[i], mapvalue)
        }
      }
    }
    if (mapvalue === true) {
      this.emit(data, event, obs)
    } else {
      for (let i in mapvalue) {
        let property = i === 'val' ? obs : obs[i]
        if (property) {
          this.findEmitInstances(data, event, property, mapvalue[i])
        } else {
          // delete mapvalue[i]
        }
      }
    }
  },

  findEmitContext (data, event, obs, mapvalue) {
    let instances = obs._instances
    if (instances) {
      for (let i = instances.length - 1; i >= 0; i--) {
        if (instances[i] !== obs && instances[i]._input === obs._input) {
          // SUBSCRIPTION GUARD
          if (!instances[i]._substamp || instances[i]._substamp !== event.stamp) {
            instances[i]._substamp = event.stamp
            this.findEmitContext(data, event, instances[i], mapvalue)
          }
        }
      }
    }
    this.findEmit(data, event, obs, mapvalue)
  },

  resub (data, event, obs, mapvalue) {
    if (mapvalue === true) {
      if (obs._input !== null) {
        this.subField(data, event, obs, obs._on[this.key].pattern, 1, { val: true })
      }
    } else {
      for (let i in mapvalue) {
        let property = i === 'val' ? obs : obs[i]
        if (property) {
          this.resub(data, event, property, mapvalue[i])
        } else {
          // delete mapvalue[i]
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
          // delete mapvalue[i]
        }
      }
    }
  }
}
