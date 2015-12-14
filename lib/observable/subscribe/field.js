'use strict'
var dataListeners = require('./listeners/data')
var getDepth = require('./current/get/depth')
var getLevel = require('./current/get/level')
// var getId = require('./current/get/id')
var setId = require('./current/set/id')
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
      let endpointid
      if (value === true) {
        id = field.uid
        endpointid = this.uid + '' + id
      } else if (typeof value === 'function') {
        id = field.uid
        endpointid = this.uid + '' + id
        field._condition = value
      } else if (getDepth(current) <= getDepth(value)) {
        id = field.uid
        endpointid = this.uid + '' + id
        this.removeDataListeners(endpointid)
      }

      if (id) {
        if (data) {
          data = createData(obs, data)
          this.findEmit(data, event, obs, mapvalue)
        }
        if (obs.on) {
          if (!mergeListener(obs, 'data', endpointid, mapvalue)) {
            obs.on('data', [onData, this, field, current, mapvalue], endpointid)
          }
        }
        field.set(setId(current, id))
        this.removeRefListeners()
      }
    }

    return this.subObj(data, event, obs, field, current, mapvalue, {})
  },

  subFieldRef (data, event, obs, field, current, mapvalue, map, context) {
    var value = field._input
    if (value) {
      let id
      let endpointid
      if (value === true) {
        id = field.uid
        endpointid = this.uid + '' + id
      } else {
        let prevDepth = getDepth(value)
        if (prevDepth) {
          let currDepth = getDepth(current)
          if (getDepth(current) < prevDepth) {
            id = field.uid
            endpointid = this.uid + '' + id
            this.removeDataListeners(endpointid)
          } else if (prevDepth === currDepth) {
            let prevLevel = getLevel(current)
            if (prevLevel && getLevel(current) <= prevLevel) {
              id = field.uid
              endpointid = this.uid + '' + id
              this.removeDataListeners(endpointid)
            }
          }
        } else if (getLevel(value) > getLevel(current)) {
          id = field.uid
          endpointid = this.uid + '' + id
          this.removeDataListeners(endpointid)
        }
      }

      if (id) {
        // update the current with new id
        // and store it on the field
        field.set(setId(current, id))
        if (data) {
          data = createData(obs, data)
          this.findEmit(data, event, context, mapvalue)
        }
        if (obs.on) {
          if (!mergeListener(obs, 'data', endpointid, mapvalue)) {
            obs.on('data', [onDataRef, this, field, current, mapvalue, context], endpointid)
          }
        }
        // remove reference listeners
        this.removeRefListeners()
      }
    }
    return this.subObjRef(data, event, obs, field, current, mapvalue, map, context)
  },

  removeDataListeners (endpointid) {
    var listens = this.listensOnAttach
    for (var i in listens) {
      if (i[0] !== '_' && i !== 'key') {
        let property = listens[i]
        if (property.key === 'data') {
          let attach = property.attach
          for (let i in attach) {
            if (i == endpointid) {
              attach.removeProperty(attach[i], i)
            }
          }
        }
      }
    }
  },

  removeRefListeners () {
    var listens = this.listensOnAttach
    for (var i in listens) {
      if (i[0] !== '_' && i !== 'key') {
        let property = listens[i]
        if (property.key === 'reference') {
          let attach = property.attach
          for (let i in attach) {
            if (i[0] !== '_' && i !== 'key') {
              let prop = attach[i]
              if (prop && !keepListener(prop[2][1], prop[3])) {
                attach.removeProperty(prop, i)
              }
            }
          }
        }
      }
    }
  }
}
