'use strict'
var dataListeners = require('./listeners/data')
var getDepth = require('./current/get/depth')
var getLevel = require('./current/get/level')
var getId = require('./current/get/id')
var setId = require('./current/set/id')

var onDataRef = dataListeners.reference
var onData = dataListeners.direct

exports.define = {
  subField (data, event, obs, field, current, mapvalue) {
    var value = field.val
    if (typeof value === 'object') {
      return this.subObj(data, event, obs, value, current, mapvalue, {})
    }
    let id
    let endpointid
    if (value === true) {
      id = this.generateId()
      endpointid = this.key + id
    } else {
      if (getDepth(current) <= getDepth(value)) {
        id = getId(value)
        endpointid = this.key + id
        this.removeDataListeners(endpointid)
      }
    }
    if (id) {
      if (data) {
        // emit it
        // this.findEmit(data, event, obs, mapvalue)
        onData.call(obs, data, event, this, field, mapvalue)
      }

      console.log('subscribing!', obs.path)

      obs.on('data', [onData, this, field, mapvalue], endpointid)
      field.val = setId(current, id)
      // remove reference listeners
      this.removeRefListeners()
    }
    return true
  },

  subFieldRef (data, event, obs, field, current, mapvalue, map, context) {
    var value = field.val
    if (typeof value === 'object') {
      return this.subObj(data, event, obs, value, current, mapvalue, map, context)
    }
    let id
    let endpointid
    if (value === true) {
      id = this.generateId()
      endpointid = this.key + id
    } else {
      let prevDepth = getDepth(value)
      if (prevDepth) {
        let currDepth = getDepth(current)
        if (getDepth(current) < prevDepth) {
          id = getId(value)
          endpointid = this.key + id
          this.removeDataListeners(endpointid)
        } else if (prevDepth === currDepth) {
          let prevLevel = getLevel(current)
          if (prevLevel && getLevel(current) <= prevLevel) {
            id = getId(value)
            endpointid = this.key + id
            this.removeDataListeners(endpointid)
          }
        }
      } else if (getLevel(value) > getLevel(current)) {
        id = getId(value)
        endpointid = this.key + id
        this.removeDataListeners(endpointid)
      }
    }

    if (id) {
      // update the current with new id
      // and store it on the field
      if (data) {
        // emit it reference style
        // this.findEmit(data, event, context, mapvalue)
        onDataRef.call(obs, data, event, this, field, mapvalue, context)
      }      
      console.log('hahah!',obs.path,data)
      obs.on('data', [onDataRef, this, field, mapvalue, context], endpointid)
      field.val = setId(current, id)
      // remove reference listeners
      this.removeRefListeners()
    }

    return true
  },

  removeDataListeners (endpointid) {
    this.listensOnAttach.each(function (property) {
      if (property.key === 'data') {
        property.attach.each(function (prop, key) {
          console.log('removing...',key, endpointid)
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
