'use strict'
var Event = require('../../event')
var triggerBind = require('../trigger/bind')
exports.define = {
  trigger (binds, event) {
    console.log('yo bitch doing contion mofo', event, this._input)
    var method = this._input
    // console.log('?')
    if (method) {
      // console.log('?')
      var ev = new Event(this._parent.key)
      var data
      ev.condition = true
      // var
      // if (!data) {
        // data = this.parent.getData(event, bind)
      // }
      // for (let uid in binds) {
      //   if (uid !== 'val') {
      //     let bind = binds[uid]
      //     triggerBind(this, bind, ev, data)
      //   }
      // }
      // console.log(binds)
      var t = this.parent.parent.parent
      var emitter = this.parent
      method.call(t, data, function () {
        // console.log('???', arguments)
        // need to store data for eahc bind here..
        for (let uid in binds) {
          if (uid !== 'val') {
            let bind = binds[uid]
            // module.exports = function (emitter, bind, event, data) {
              // console.log('yo bind', bind, binds, uid)
            triggerBind(emitter, bind, ev, data)
          }
        }
      }, ev)
    }
  }
}
