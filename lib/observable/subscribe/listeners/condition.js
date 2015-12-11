'use strict'
var getId = require('../current/get/id')
var getDepth = require('../current/get/depth')

module.exports = {
  direct (data, event, emitter, pattern, current, condition, mapvalue, fromUpward) {
    let incomplete = testCondition(this, condition)
    if (!incomplete) {
      let depth = getDepth(current)
      let value = pattern._input
      if (!value || getDepth(value) > depth) {
        if (!value) {
          pattern.set(true)
        }
        emitter._fromCondition = true
        emitter.subField(data, event, this, pattern, current, mapvalue)
        emitter._fromCondition = void 0
      }
      if (!data) {
        emitter._fulfilled = true
      }
    } else {
      if (pattern._input) {
        let enpointid = emitter.uid + '' + pattern.uid
        pattern.set(false)
        emitter.removeDataListeners(enpointid)
        if (fromUpward) {
          let parent = this
          let map
          while (pattern.key !== '$upward') {
            for (let i in mapvalue) {
              parent = parent[i]
              if (parent) {
                map = mapvalue
                mapvalue = mapvalue[i]
                break
              }
            }
            pattern = pattern.parent
          }
          emitter._fromCondition = false
          emitter.subUp(data, event, parent, pattern, current, mapvalue, map)
          emitter._fromCondition = void 0
        }
      }
    }
  },

  // reference (data, event, emitter, condition, mapvalue, context) {
  //   if (data === null) {
  //     let incomplete = testCondition(this, condition)
  //     if (!incomplete) {
  //       data = createData(this, data)
  //       emitter.findEmit(data, event, context, mapvalue)
  //     }
  //   }
  // }
}

function testCondition (obs, condition) {
  var incomplete
  // condition can contain several keys
  for (let key in condition) {
    let property = obs[key]
    let value = condition[key]
    // if property exists, check if condition is fulfilled
    if (property && property._input !== null) {
      let type = typeof value
      if (type === 'object') {
        incomplete = testCondition(property, value)
      } else if (type !== 'function' || value.call(obs, property)) {
        // condition fulfilled!
      } else {
        incomplete = true
      }
    } else {
      incomplete = true
    }
  }
  return incomplete
}
