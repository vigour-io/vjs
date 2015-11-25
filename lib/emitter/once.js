'use strict'

exports.define = {
  once (val, key, unique, event) {
    var _this = this
    function once () {
      _this.off(once)
      return val.apply(this, arguments)
    }
    return this.on(once, key, unique, event)
  }
}
