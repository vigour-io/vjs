'use strict'
var Base = require('../../base')

module.exports = function (observable, event) {
  exports.properties = {
    storage: true
  }
  exports.define = {
    storageKey: {
      get () {
        var key = this._storageKey
        if (!key) {
          let storage = this.storage
          if (storage) {
            if (typeof storage === 'function') {
              key = storage()
            } else if (storage instanceof Base) {
              key = storage.parseValue()
            } else {
              key = storage
            }
          } else {
            key = this.path.join('.')
          }
          if (!key) {
            return
          }
          this._storageKey = key
        }
      }
    }
  }
  exports.on = {
    new: {
      storage (data, event) {
        var stored = global.localStorage.getItem(this.storageKey)
        if (stored) {
          this.set(stored, event)
        }
      }
    },
    data: {
      storage (data, event) {
        global.localStorage.setItem(this.storageKey, data)
      }
    }
  }
  observable.set(exports, event)
  exports.on.new.storage.call(observable, void 0, event)
}
