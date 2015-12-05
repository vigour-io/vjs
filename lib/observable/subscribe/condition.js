'use strict'

exports.define = {
  subCondition (data, event, obs, pattern, current, mapvalue, map) {
    let $condition = pattern.$condition
    // test conditions, one by one
    for (let i = 0; i < $condition.length; i++) {
      let condition = $condition[i]
      let fulfilled = testCondition(obs, condition)
      console.log('fulfilled:',fulfilled)
    }
  }
}

function testCondition (obs, condition) {
  var incomplete
  // condition can contain several keys
  for (let key in condition) {
    let property = obs[key]
    let value = condition[key]
    // if property exists, check if condition is fulfilled
    if (property) {
      while (typeof value === 'object') {
        
      }
      if (value.call(obs, property)) {
        // condition fulfilled!
      } else {
        incomplete = true
      }
    } else {
      incomplete = true
    }
  }
}
