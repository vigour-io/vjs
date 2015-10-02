'use strict'
var isEmpty = require('../util').isEmpty

exports.properties = {
  data: true
}

exports.define = {
  storeData: function (event, data) {
    if (this.data === void 0) {
      this.data = {}
    }
    if (!this.data[event.stamp]) {
      this.data[event.stamp] = data
    }
    return data
  },
  getData: function (event) {
    return this.data && this.data[event.stamp]
  },
  removeData: function (event) {
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
