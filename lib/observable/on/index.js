'use strict'

exports.properties = {
  on: { val: require('./constructor'), override: '_on' }
  // condition: function (val, event)
  // is ($is word operator)
  // once
}

exports.define = {
  on: function (type, val, key, unique, event) {
    if (typeof type !== 'string') {
      return this.on('data', type, val, key, unique)
    } else {
      var context
      var observable = this
      var on = this.hasOwnProperty('_on') && this._on

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
      // this will all go to emitter only interface thats nesecary is on
      // set of emitter takes care of context resolvement etc
      return observable
    }
  }
}
