'use strict'
module.exports = function attachListener (obj, type, attach) {
  var on = obj._on
  if (on) {
    let listener = on[type]
    if (listener) {
      let attach = listener.attach
      if (attach) {
        let alreadyHaveListener = attach.each((prop) => {
          return prop[1] === this
        })
        if (alreadyHaveListener) {
          return
        }
      }
    }
  }
  obj.on(type, attach)
}
