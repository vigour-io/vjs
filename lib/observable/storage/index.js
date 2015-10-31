'use strict'
var Base = require('../../base')
var hash = require('../../util/hash')
var isPlainObj = require('../../util/is/plainobj')
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
            key = this.path.join('.') // hash
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
    var stored = global.localStorage.getItem(this.storageKey)
    console.log('!@#!ewwewe@#!@#', stored, this.path) // he makes his own why no event?
    if (stored) {
      console.log('do something?', stored)
      this.set(stored, event)
    }
  }

  exports.on = {
    new: {
      storage: getFromStorage
    },
    data: {
      storage (data, event) {
        if (!isPlainObj(data)) {
          if (data instanceof Base) {
            data = data.val
          }
          if (typeof data !== 'object') {
            global.localStorage.setItem(this.storageKey, data)
          } else {
            console.warn('---> oki doki!', this.path)
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
