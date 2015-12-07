'use strict'

function Bind () {}
Bind.prototype.type = 0
Bind.prototype.data = void 0
Bind.prototype.val = void 0

// and uuids
exports.define = {
  getBind (event, bind) {
    var stamp = event.stamp
    return this.Tbinds && this.Tbinds[stamp] && this.Tbinds[stamp][bind.uid]
  },
  setBind (event, bind, data) {
    if (!this.Tbinds || !this.hasOwnProperty('Tbinds')) {
      this.Tbinds = {}
    }
  },
  clearBind (event, bind) {

  }
}
