'use strct'
var Promise = require('bluebird')

exports.define = {
  is (val, callback, event) {
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
    var ret = this
    var parsed = this.val
    if (!callback) {
      ret = new Promise(function (resolve, reject) {
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
      let _this = this
      this.on('data', function is (data, event) {
        if (compare(this.val)) {
          _this.off(is)
          callback.call(this, data, event)
        }
      })
    }
    return ret
  }
}
