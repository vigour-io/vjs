'use strict'

var Promise = require('bluebird')

exports.define = {
  is (val, callback, event) {
    // need to attach when, remove the promise etc on remove -- remove the rmeove listener when done
    // needs optimization later
    // when removing listener have to remove the promise as well!
    var type = typeof val
    var compare
    if (type === 'function') {
      compare = val
    } else {
      compare = function (compare) {
        return compare == val //eslint-disable-line
      }
    }
    var promise
    var rejectit
    var parsed = this.val
    if (!callback) {
      // promise -- if promise need to remove
      promise = new Promise(function (resolve, reject) {
        // on cancel and on reject
        rejectit = reject
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
      // need to use _this since the context this can be different
      let _this = this
      if (promise) {
        // cancel
        _this.on('remove', rejectit)
      }
      this.on('data', function is (data, event) {
        if (compare(this.val)) {
          // reuse this check over all later
            _this.off('remove', rejectit)
          _this.off('data', is)
          callback.call(this, data, event)
        }
      })
    }
    return promise || this
  }
}
