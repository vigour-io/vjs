'use strict'
var isEmpty = require('../util/is/empty')

exports.properties = {
  data: true
}

exports.define = {
  storeData (event, data, bind) {
    if (this.data === void 0) {
      this.data = {}
    }

    if (!this.data[event.stamp]) {
      this.data[event.stamp] = {}
    }

    if (bind && bind !== this) {
      console.log('storing!', data, bind && bind._path.join('.'), bind.uid, event.stamp, this._path.join('.'))

      // do something like always check if val (store val not on an object) perf
      this.data[event.stamp][bind.uid] = data
    } else {
      this.data[event.stamp].val = data
    }
    return data
  },
  getData (event, bind) {
    // console.log(this.data)
    var eventStore = this.data && this.data[event.stamp]
    if (!eventStore) {
      return
    }
    if (bind && bind !== this) {
      return eventStore[bind.uid]
    }
    return eventStore.val
  },
  removeDataStorage (event) {
    // also use full path / bind?
    console.error('REMOVE THE DATA!', event.stamp, this._path)
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
