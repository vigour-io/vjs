'use strict'

exports.properties = {
  on: { val: require('./constructor'), override: '_on' }
}

// do same trick as emit use the emitter on
exports.define = {
  on (type, val, key, unique, event) {
    if (typeof type !== 'string') {
      return this.on('data', type, val, key, unique)
    } else {
      var context
      var observable = this
      var on = this.hasOwnProperty('_on') && this._on
      var override = this.getProperty('on', type, 'override')
      if (override) {
        type = override
      }
      if (!on || !on[type] || on._context) {
        var set = { on: {} }
        set.on[type] = {}
        context = this._context
        if (context) {
          observable = this.resolveContext(set, false, context, true)
        } else {
          this.set(set, false)
        }
      }
      observable._on[type].on(val, key, unique, event)
      return observable
    }
  },
  once (type, val, key, unique, event) {
    
    // this is oging to use internal emitter on!
    // var _this = this
    // function once () {
    //   if (typeof type !== 'string') {
    //     type = 'data'
    //   }
    //   _this.off(type, once)
    //   return val.apply(this, arguments)
    // }
    // this.on(type, once)
  }
}
