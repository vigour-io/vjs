'use strict'
var Base = require('../../base')
var hash = require('../../util/hash')
var isPlainObj = require('../../util/is/plainobj')
var storageType = 'localStorage'

if ( window.localStorage === null || window.localStorage === void 0 ) {
  storageType = 'sessionStorage'
}
module.exports = function (observable, event) {

  exports.properties = {
    storage: true
  }

  exports.define = {
    storageKey: {
      get () {
        var key = this.hasOwnProperty('_storageKey') && this._storageKey
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
            key = hash(this.path.join('.'))
          }
          if (!key) {
            return
          }
          this._storageKey = key
        }
        return key
      }
    }
  }

  function getFromStorage (data, event) {
    var stored = window[storageType].getItem(this.storageKey)
    if (stored) {
      this.set(stored, event)
    }
  }

  exports.on = {
    new: {
      storage: getFromStorage
    },
    data: {
      storage (data, event) {
        if (data === null && this.storageKey) {
          window[storageType].removeItem(this.storageKey)
          return
        }
        if (!isPlainObj(data)) {
          if (data instanceof Base) {
            data = data.val
          }
          if (typeof data !== 'object') {
            window[storageType].setItem(this.storageKey, data === false ? '' : data)
          }
        } else {
          getFromStorage.call(observable, void 0, event)
        }
      }
    }
  }
  observable.set(exports, event)
  getFromStorage.call(observable, void 0, event)
}
