'use strict'
module.exports = function subscribePattern (data, event, obs) {
  return this.subscribeObject(data, event, obs, obs.pattern, 0, true, {})
}
