'use strict'
var reference = require('../../util/get/reference')
var dataListeners = require('./listeners/data')
var getDepth = require('./current/get/depth')
var getLevel = require('./current/get/level')
// var setId = require('./current/set/id')
var createData = require('./createdata')
var onDataRef = dataListeners.reference
var onData = dataListeners.direct
var mergeListener = require('./merge')

var keepListener = require('./keep')

exports.define = {

  subField (data, event, obs, field, current, mapvalue) {
    var value = field._input
    if (value) {
      let id
      if (value === true) {
        id = this.uid + '' + field.uid
      } else if (typeof value === 'function') {
        id = this.uid + '' + field.uid
      } else if (getDepth(current) <= getDepth(value)) {
        id = this.uid + '' + field.uid
        this.removeDataListeners(id)
      }
      if (id) {
        field.set(current)
        // remove reference listeners
        this.removeRefListeners(id)

        if (data) {
          field.setKey('_stamp', obs._lastStamp)
          data = createData(obs, obs._input)
          this.findEmit(data, event, obs, mapvalue)
        }
        if (obs.on) {
          if (!mergeListener(obs, 'data', id, mapvalue)) {
            obs.on('data', [onData, this, field, current, mapvalue], id)

            let ref = reference(obs)
            if (ref) {
              if (ref.onSub) {
                if (!field._ignore) {
                  let onRemove = this.onRemove
                  if (onRemove) {
                    onRemove.push(ref)
                  } else {
                    this.onRemove = [ref]
                  }
                  obs.once('reference', [ function (data, event, emitter) {
                    data.onSubRemove && data.onSubRemove(emitter, event)
                  }, this], id)
                  ref.onSub(data, event, this, field, current, mapvalue, false, obs)
                }
              }
            }
          }
        }
      }
    }
    return this.subObj(data, event, obs, field, current, mapvalue, {})
  },

  subFieldRef (data, event, obs, field, current, mapvalue, map, context) {
    var value = field._input
    if (value) {
      let id
      if (value === true) {
        id = this.uid + '' + field.uid
      } else {
        let prevDepth = getDepth(value)
        if (prevDepth) {
          let currDepth = getDepth(current)
          if (getDepth(current) < prevDepth) {
            id = this.uid + '' + field.uid
            this.removeDataListeners(id)
          } else if (prevDepth === currDepth) {
            let prevLevel = getLevel(current)
            if (prevLevel && getLevel(current) <= prevLevel) {
              id = this.uid + '' + field.uid
              this.removeDataListeners(id)
            }
          }
        } else if (getLevel(value) > getLevel(current)) {
          id = this.uid + '' + field.uid
          this.removeDataListeners(id)
        }
      }

      if (id) {
        // update the current with new id
        // and store it on the field
        field.set(current)

        // remove reference listeners
        this.removeRefListeners(id)

        if (data) {
          field.setKey('_stamp', obs._lastStamp)
          data = createData(obs, obs._input)
          this.findEmit(data, event, context, mapvalue)
        }
        if (obs.on) {
          if (!mergeListener(obs, 'data', id, mapvalue)) {
            obs.on('data', [onDataRef, this, field, current, mapvalue, context], id)
            let ref = reference(obs)
            if (ref) {
              if (ref.onSub) {
                if (!field._ignore) {
                  let onRemove = this.onRemove
                  if (onRemove) {
                    onRemove.push(ref)
                  } else {
                    this.onRemove = [ref]
                  }
                  obs.once('reference', [ function (data, event, emitter) {
                    data.onSubRemove && data.onSubRemove(emitter, event)
                  }, this], id)
                  ref.onSub(data, event, this, field, current, mapvalue, false, obs)
                }
              }
            }
          }
        }
      }
    }
    return this.subObjRef(data, event, obs, field, current, mapvalue, map, context)
  },

  removeDataListeners (id) {
    var listens = this.listensOnAttach
    for (var i in listens) {
      if (i[0] !== '_' && i !== 'key') {
        let property = listens[i]
        if (property.key === 'data') {
          let attach = property.attach
          for (let i in attach) {
            if (i == id) {
              attach.removeProperty(attach[i], i)
            }
          }
        }
      }
    }
  },

  removeRefListeners (id) {
    var listens = this.listensOnAttach
    for (var i in listens) {
      if (i[0] !== '_' && i !== 'key') {
        let property = listens[i]
        if (property.key === 'reference') {
          let attach = property.attach
          for (let j in attach) {
            if (j[0] !== '_' && j !== 'key') {
              let prop = attach[j]
              if (j === id || prop && !keepListener(prop[2][1], prop[3])) {
                // let obs = listens[i]._parent._parent
                // obs.onSubRemove && obs.onSubRemove(this)
                attach.removeProperty(prop, j)
              }
            }
          }
        }
      }
    }
  }
}
