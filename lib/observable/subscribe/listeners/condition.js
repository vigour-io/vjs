'use strict'
var getId = require('../current/get/id')

module.exports = {
  direct (data, event, emitter, pattern, current, condition, mapvalue) {
    let incomplete = data.data === null || testCondition(this, condition)
    if (!incomplete) {
      if (!pattern._input) {
        pattern.set(true)
        emitter.subField(data, event, this, pattern, current, mapvalue)
      }
    } else {
      if (pattern._input) {
        let enpointid = emitter.uid + '' + getId(pattern._input)
        pattern.set(false)
        emitter.removeDataListeners(enpointid)
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
    if (property) {
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
