'use strict'
exports.define = {
  postpone (id, fn, time) {
    var self = this
    if (typeof id === 'function') {
      time = fn
      fn = id
    }
    if (!self.__postponed) {
      let remove = this._Constructor.prototype.remove
      self = self.set({
        define: {
          remove () {
            for (var id in this.__postponed) {
              clearTimeout(this.__postponed[id])
              this.__postponed[id] = null
            }
            remove.apply(this, arguments)
          }
        },
        properties: {
          __postponed: {
            val: {}
          }
        }
      }) || this
    } else if (self.__postponed[id]) {
      clearTimeout(self.__postponed[id])
      self.__postponed[id] = null
    }
    let store = self.storeContext()
    self.__postponed[id] = setTimeout(function () {
      self.applyContext(store)
      fn.call(self)
    }, time)
  }
}
