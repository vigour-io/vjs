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
    console.log('subField',value)
    if (typeof value === 'object') {
      return this.subObj(data, event, obs, value, current, mapvalue, {})
    }
    let id
    if (value === true) {
      id = this.generateId()
    } else {
      if (getDepth(current) <= getDepth(value)) {
        id = getId(value)
      }
    }
    if (id) {
      if (data) {
        // emit it
        this.findEmit(data, event, obs, mapvalue)
      }
      obs.on('data', [onData, this, field, mapvalue], this.key + id)
      field.val = setId(current, id)
      // remove reference listeners
      this.removeRefListeners(keepRefListener)
    }
    return true
  },

  removeRefListeners (check) {
    var listeners = this.listensOnAttach
    if (listeners) {
      listeners.each(function (property) {
        if (property.key === 'reference') {
          let attach = property.attach
          attach.each(function (property, key) {
            if (!check(property[2][1], property[3])) {
              attach.removeProperty(property, key)
            }
          })
        }
      })
    }
  },

  subFieldRef (data, event, obs, field, current, mapvalue, context) {
    var value = field.val
    if (typeof value === 'object') {
      return this.subObj(data, event, obs, value, current, mapvalue, context)
    }
    let id
    if (value === true) {
      id = this.generateId()
    } else {
      let prevDepth = getDepth(value)
      if (prevDepth) {
        let currDepth = getDepth(current)
        if (getDepth(current) < prevDepth) {
          id = getId(value)
        } else if (prevDepth === currDepth) {
          let prevLevel = getLevel(current)
          if (prevLevel && getLevel(current) <= prevLevel) {
            id = getId(value)
          }
        }
      }
    }

    console.error('id?',id, data)

    if (id) {
      // update the current with new id
      // and store it on the field
      if (data) {
        // emit it reference style
        this.findEmitRef(data, event, obs, mapvalue, context)
      }
      obs.on('data', [onDataRef, this, field, mapvalue, context], this.key + id)
      field.val = setId(current, id)
      // remove reference listeners
    }

    return true
  }
}

function keepRefListener (pattern, refinfo) {
  return pattern.each((property, key) => {
    let value = property.val
    if (typeof value === 'object') {
      return keepRefListener(value, refinfo)
    }
    if (value === true) {
      return true
    }
    if (getLevel(value) > getLevel(refinfo)) {
      return true
    }
  })
}

// function keepRefListenerRef(pattern, refinfo) {
//   return pattern.each((property, key) => {
//     let value = property.val
//     if (typeof value === 'object') {
//       return keepRefListener(value, refinfo)
//     }
//     if (value === true) {
//       return true
//     }
//     if (isCloserOrSame(value, refinfo)) {
//       return true
//     }
//   })
// }