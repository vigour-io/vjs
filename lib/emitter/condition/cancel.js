'use strict'
exports.properties = {
  cancel () {
    console.warn('cancel, not implemented yet')
  }
}

exports.define = {
  cancel (data, event) {
    if (data instanceof Error) {
      // use bind!
      this.getBind().emit('error', data)
    }
    // is this correct???
    // only null
    if (event) {
      // this.parent.binds = null
      // this.parent.contextsBinds = null
    } else {
      this.parent.binds = null
      this.parent.contextsBinds = null
      for (var key in this.inProgress) {
        this.inProgress[key].clear()
      }
    }
    // all cleared or just the one?
    // this.inProgress.clear()
  }
}
