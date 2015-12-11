'use strict'
var conditionListeners = require('./listeners/condition')
var onCondition = conditionListeners.direct
// var onConditionRef = conditionListeners.reference

exports.define = {
  subCondition (data, event, obs, pattern, current, mapvalue, map) {
    var $condition = pattern.$condition
    var length = $condition.length
    if (obs._context) {
      obs.clearContext()
    }
    if (length) {
      let incomplete
      for (let i = 0; i < length; i++) {
        let condition = $condition[i]
        obs.subscribe(condition, [onCondition, this, pattern, current, condition, mapvalue, this._fromUpward]).run(data || false)
        if (this._fulfilled) {
          this._fulfilled = null
        } else {
          incomplete = true
        }
        return !incomplete
      }
    } else {
      obs.subscribe($condition, [onCondition, this, pattern, current, $condition, mapvalue, this._fromUpward]).run(data || false)
      if (this._fulfilled) {
        this._fulfilled = null
        return true
      }
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
