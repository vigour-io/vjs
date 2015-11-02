'use strict'
module.exports = function addSubListener (obj, type, attach, id) {
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
  obj.on(type, attach, id)
}
