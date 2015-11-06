'use strict'
var dataListeners = require('./listeners/data')
var getDepth = require('./current/get/depth')
var getLevel = require('./current/get/level')
var getId = require('./current/get/id')

var onDataRef = dataListeners.reference
var onData = dataListeners.direct

exports.define = {
  subField (data, event, obs, field, current, mapvalue, map) {
    var value = field.val
    if (typeof value === 'object') {
      return this.subObj(data, event, obs, value, current, mapvalue, {})
    }

    console.log('subField', value, data)
    let id
    if (value === true) {
      id = this.generateId()
    } else {
      let prevDepth = getDepth(value)
      if (prevDepth) {
        let currDepth = getDepth(current)
        if (currDepth <= prevDepth) {
          id = getId(value)
        }
      }
    }

    if (id) {
      if (data) {
        // emit it
        this.findEmit(data, event, obs, mapvalue, map)
      }
      obs.on('data', [onData, this, field, mapvalue, {}], this.key)
      // add data listener
    }

    return true
  },
  subFieldRef (data, event, obs, field, current, mapvalue) {
    var value = field.val
    if (typeof value === 'object') {
      return this.subObjRef(data, event, obs, value, current, mapvalue, {})
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

    if (id) {
      // update the current with new id
      // and store it on the field
      if (data) {
        // emit it reference style
      }
      // add specific reference data listener
    }

    return true
  }
}
