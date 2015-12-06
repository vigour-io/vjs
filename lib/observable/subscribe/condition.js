'use strict'
var conditionListeners = require('./listeners/condition')
var onCondition = conditionListeners.direct
var Event = require('../../event')
// var onConditionRef = conditionListeners.reference

exports.define = {
  subCondition (data, event, obs, pattern, current, mapvalue) {
    let $condition = pattern.$condition
    let length = $condition.length

    if (!event) {
      // event = new Event(this._parent._parent, this.key)
    }

    if (length) {
      for (let i = 0; i < length; i++) {
        let condition = $condition[i]
        obs.subscribe(condition, [onCondition, this, condition, mapvalue]).run(event)
      }
    } else {
      obs.subscribe($condition, [onCondition, this, $condition, mapvalue]).run(event)
    }
  },

  // subConditionRef (data, event, obs, pattern, current, mapvalue, map) {
  //   let $condition = pattern.$condition
  //   let length = $condition.length
  //   if (length) {
  //     for (let i = 0; i < length; i++) {
  //       let condition = $condition[i]
  //       obs.subscribe(condition, [onCondition, this, condition, mapvalue]).run()
  //     }
  //   } else {
  //     obs.subscribe($condition, [onCondition, this, $condition, mapvalue]).run()
  //   }
  // }
}
