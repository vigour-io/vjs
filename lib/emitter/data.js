'use strict'
var isEmpty = require('../util/is/empty')

exports.properties = {
  data: true
}

exports.define = {
  storeData: function (event, data) {
    if (this.data === void 0) {
      this.data = {}
    }
    this.data[event.stamp] = data
    return data
  },
  getData: function (event) {
    return this.data && this.data[event.stamp]
  },
  removeDataStorage: function (event) {
    if (this.data) {
      if (this.data[event.stamp]) {
        delete this.data[event.stamp]
        if (isEmpty(this.data)) {
          delete this.data
        }
      }
    }
  }
}
