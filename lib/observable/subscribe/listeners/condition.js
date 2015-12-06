'use strict'
var createData = require('../createdata')

module.exports = {
  direct (data, event, emitter, condition, mapvalue) {
    let incomplete = testCondition(this, condition)
    if (!incomplete) {
      data = createData(this, data)
      emitter.findEmit(data, event, this, mapvalue)
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
      if (value === 'object') {
        return testCondition(property, value)
      }
      if (type !== 'function' || value.call(obs, property)) {
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
