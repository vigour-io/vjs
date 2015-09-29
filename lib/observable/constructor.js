var Event = require('../event')

exports.define = {
  generateConstructor: function () {
    return function derivedObservable (val, event, parent, key) {
      this.clearContext()
      if (this.trackInstances) {
        this.addToInstances(event)
      }
      // TODO: this is a very specific fix for on, do this smarter!
      if (this._on) {
        this._on.newParent(this, event)
      }
      // ----------------
      this.setParent(val, event, parent, key)
      if (val !== void 0) {
        if (event === void 0) {
          event = new Event(this, 'new')
        }
        this.set(val, event, true)
      }
      // do this better when resolve context is done, check is overhead
      this.emit('new', void 0, event === true ? void 0 : event)
    }
  }
}
