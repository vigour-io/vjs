'use strict'

var Promise = require('bluebird')
// cancellation method (non a++)
Promise.config({ cancellation: true })

exports.define = {
  is (val, callback, event) {
    var type = typeof val
    var compare
    var promise
    var parsed = this.val

    if (type === 'function') {
      compare = val
    } else {
      compare = function (compare) {
        return compare == val //eslint-disable-line
      }
    }

    if (!callback) {
      promise = new Promise(function (resolve, reject) {
        // on cancel and on reject
        // reject
        callback = function (data, event) {
          resolve(this, data, event)
        }
      })
    }

    if (compare(parsed)) {
      if (callback) {
        callback.call(this, parsed, event)
      }
    } else {
      // need to use _this since the context of "this" can be different
      let _this = this
      let is = function (data, event) {
        if (compare(this.val)) {
          removeIs(_this, is, promise)
          callback.call(this, data, event)
        }
      }
      if (promise) {
        _this.on('remove', function () {
          removeIs(_this, is, promise, promise)
        })
      }
      this.on('data', is)
    }
    return promise || this
  }
}

function removeIs (obs, is, self, promise) {
  obs.off('data', is)
  if (self) {
    obs.off('remove', removeIs)
  }
  if (promise) {
    promise.cancel()
  }
}
