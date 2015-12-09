'use strict'
exports.define = {
  clear (event) {
    // this feels super weird
    console.error('clear!', event.stamp)
    this.removeQueue(event) // moet ook veel meer efficient!
    if (this.binds) {
      delete this.binds[event.stamp]
    }
  }
}
