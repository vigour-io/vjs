'use strict'
var Base = require('../../base')
var remove = Base.prototype.remove
// var Event = require('../../event')

// something like this for the util -- double check
// contexts and instances -- take input into account
// var isIncluded = function (arr, bind, event) {
//   for (var i in arr) {
//     var item = arr[i]
//     var stamp = item.event.$stamp
//     var inherits
//     if (item.bind === bind &&
//       stamp === event.stamp ||
//       (inherits = event.inherits) &&
//       inherits.stamp === stamp
//     ) {
//       return true
//     }
//   }
// }

module.exports = new Base({
  key: 'condition',
  properties: {
    inProgress: true,
    cancel: function (val) {
      // this._cancel = val
      // if (this.inProgress) {
      // maak util functie hiervoor
      // }
    }
  },
  define: {
    emit: function (type) {
      console.warn('emit emit emit!')
    },
    remove: function () {
      this.cancel()
      return remove.apply(this, arguments)
    },
    cancel: function () {
      console.log('cancel')
    }
  }
}).Constructor
