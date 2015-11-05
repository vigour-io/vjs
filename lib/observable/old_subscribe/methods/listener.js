'use strict'
module.exports = function addSubListener (obj, type, attach, id) {
  var on = obj._on
  if (on) {
    let listener = on[type]
    if (listener) {
      let attach = listener.attach
      if (attach) {
        let alreadyHaveListener = attach.each((prop) => {
          // if(prop[1] instanceof this._Constructor){
          //   console.log('>>',prop[4], attach[4])
          //   let mapValueNew = attach[4]
          //   let mapValueExisting = prop[]
          //   for(let i in prop[4]){

          //   }
          //   return true
          // }
          return prop[1] === this
        })
        if (alreadyHaveListener) {
          return
        }
      }
    }
  }
  obj.on(type, attach, id || this._patternId)
}
