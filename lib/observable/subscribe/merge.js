'use strict'
var merge = require('../../util/merge')

module.exports = function mergeListener (obs, type, key, mapvalue) {
  if (typeof mapvalue === 'object') {
    let on = obs._on
    if (on) {
      let listener = on[type]
      if (listener) {
        let attach = listener.attach
        if (attach) {
          let attached = attach[key]
          if (attached) {
            merge(attached[4], mapvalue)
            return true
          }
        }
      }
    }
  }
}
