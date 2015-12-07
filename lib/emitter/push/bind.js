'use strict'

function Bind () {}
Bind.prototype.type = 0
Bind.prototype.data = void 0
Bind.prototype.val = void 0

// and uuids
exports.define = {
  getBind (event, bind) {
    var stamp = event.stamp
    return this.binds && this.binds[stamp] && this.binds[stamp][bind.uid]
  },
  setBind (event, bind, data) {
    var stamp = event.stamp
    if (!this.binds || !this.hasOwnProperty('binds')) {
      this.binds = {}
    }
    if (!this.binds[stamp]) {
      this.binds[stamp] = {}
    }
    var bound = this.binds[stamp][bind.uid] = new Bind()
    bound.val = bind
    if (data !== void 0) {
      bound.data = data
    }
  }
}
