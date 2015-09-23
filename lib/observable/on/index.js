'use strict'

exports.properties = {
  on: { val: require('./constructor'), key: '_on' }
  // condition: function (val, event) {
  //   // fix dat condition
  //   this.set({
  //     $on: {
  //       $change: {
  //         $condition: val
  //       }
  //     }
  //   }, event)
  // }
}

exports.define = {
  on: function (type, val, key, unique, event) {
    if (typeof type !== 'string') {
      return this.on('change', type, val, key, unique)
    } else {
      var context
      var observable = this
      if (!this.on ||
        !this.hasOwnProperty('on') ||
        !this.on[type] ||
        this.on._context) {
        var set = { on: {} }
        set.on[type] = {}
        context = this._context
        if (context) {
          observable = this.resolveContextSet(set, false, context, true)
        } else {
          this.set(set, false)
        }
      }
      observable.on[type].on(val, key, unique, event)
      return observable
    }
  }
}
