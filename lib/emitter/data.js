'use strict'
var isEmpty = require('../util/is/empty')

exports.properties = {
  data: true
}

exports.define = {
  storeData: function (event, data, bind) {
    if (this.data === void 0) {
      this.data = {}
    }

    if (!this.data[event.stamp]) {
      this.data[event.stamp] = {}
    }

    if (bind && bind !== this) {
      // do something like always check if val (store val not on an object) perf
      this.data[event.stamp][bind.uid] = data
    } else {
      this.data[event.stamp].val = data
    }
    return data
  },
  getData: function (event, bind) {
    var eventStore = this.data && this.data[event.stamp]
    if (!eventStore) {
      return
    }
    if (bind && bind !== this) {
      return eventStore[bind.uid]
    }
    return eventStore.val
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
