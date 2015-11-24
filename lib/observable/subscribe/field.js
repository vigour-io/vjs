'use strict'
var dataListeners = require('./listeners/data')
var getDepth = require('./current/get/depth')
var getLevel = require('./current/get/level')
var getId = require('./current/get/id')
var setId = require('./current/set/id')
var createData = require('./createdata')

var onDataRef = dataListeners.reference
var onData = dataListeners.direct
var merge = require('../../util/merge')

exports.define = {
  subField (data, event, obs, field, current, mapvalue) {
    var value = field.val
    if (typeof value === 'object') {
      return this.subObj(data, event, obs, value, current, mapvalue, {})
    }
    let id
    let endpointid
    if (value === true) {
      id = field.uid
      endpointid = this.uid + '' + id
    } else if (getDepth(current) <= getDepth(value)) {
      id = getId(value)
      endpointid = this.uid + '' + id
      this.removeDataListeners(endpointid)
    }

    if (id) {
      if (data) {
        data = createData(obs, data)
        this.findEmit(data, event, obs, mapvalue, false, event.fromParent)
      }

      let currentAttach = obs._on
        && obs._on.data
        && obs._on.data.attach
        && obs._on.data.attach[endpointid]

      if (currentAttach && typeof mapvalue === 'object') {
        merge(currentAttach[4], mapvalue)
      } else {
        console.error('WUUUUUUUT',obs.path,field.path)
        obs.on('data', [onData, this, field, current, mapvalue], endpointid)
      }

      field.val = setId(current, id)
      this.removeRefListeners()

      return id
    }
    return true
  },

  subFieldRef (data, event, obs, field, current, mapvalue, map, context) {
    var value = field.val
    if (typeof value === 'object') {
      return this.subObjRef(data, event, obs, value, current, mapvalue, map, context)
    }
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
          id = getId(value)
          endpointid = this.uid + '' + id
          this.removeDataListeners(endpointid)
        } else if (prevDepth === currDepth) {
          let prevLevel = getLevel(current)
          if (prevLevel && getLevel(current) <= prevLevel) {
            id = getId(value)
            endpointid = this.uid + '' + id
            this.removeDataListeners(endpointid)
          }
        }
      } else if (getLevel(value) > getLevel(current)) {
        id = getId(value)
        endpointid = this.uid + '' + id
        this.removeDataListeners(endpointid)
      }
    }

    console.log('id:',id,value, field.path)

    if (id) {
      // update the current with new id
      // and store it on the field
      field.val = setId(current, id)
      if (data) {
        data = createData(obs, data)
        this.findEmit(data, event, context, mapvalue, map, event.fromParent)
      }

      let currentAttach = obs._on
        && obs._on.data
        && obs._on.data.attach
        && obs._on.data.attach[endpointid]

      if (currentAttach && typeof mapvalue === 'object') {
        merge(currentAttach[4], mapvalue)
      } else {
        obs.on('data', [onDataRef, this, field, current, mapvalue, context], endpointid)
      }
      // remove reference listeners
      this.removeRefListeners()
      return id
    }
    return true
  },

  removeDataListeners (endpointid) {
    this.listensOnAttach.each(function (property) {
      if (property.key === 'data') {
        property.attach.each(function (prop, key) {
          if (key == endpointid) {
            property.attach.removeProperty(prop, key)
          }
        })
      }
    })
  },

  removeRefListeners () {
    var listeners = this.listensOnAttach
    if (listeners) {
      listeners.each(function (property) {
        if (property.key === 'reference') {
          let attach = property.attach
          attach.each(function (property, key) {
            if (!keepRefListener(property[2][1], property[3])) {
              attach.removeProperty(property, key)
            }
          })
        }
      })
    }
  }
}

function keepRefListener (pattern, refinfo) {
  return pattern.each(function (property, key) {
    let value = property.val
    if (typeof value === 'object') {
      return keepRefListener(value, refinfo)
    }
    if (value === true) {
      return true
    }
    // unify this with id check in  subField
    let prevDepth = getDepth(value)
    if (prevDepth) {
      let refDepth = getDepth(refinfo)
      if (prevDepth > refDepth) {
        return true
      } else if (prevDepth === refDepth) {
        if (getLevel(value) > getLevel(refinfo)) {
          return true
        }
      }
    } else if (getLevel(value) > getLevel(refinfo)) {
      return true
    }
  })
}
