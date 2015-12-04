'use strict'
var dataListeners = require('./listeners/data')
var dataListener = dataListeners.direct

exports.define = {
  subCondition (data, event, obs, pattern, current, mapvalue, map) {
    let $condition = pattern.$condition
    for (let i = 0; i < $condition.length; i++) {
      let condition = $condition[i]
      let found
      for (let key in condition) {
        let property = obs[key]
        let value = condition[key]
        if (property) {
          console.log('--->',property.path, value.call(obs, property))
        }
      }
    }
  }
}

// 
