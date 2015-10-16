'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')
exports.inject = [
  require('./val')
]

exports.properties = {
  $: {
    val: new Operator({
      key: '$',
      define: {
        set: function (pattern) {
          if (typeof pattern === 'string') {
            var keys = pattern.split('.')
            var value = true
            for (var i = keys.length - 1; i >= 0; i--) {
              pattern = {}
              pattern[keys[i]] = value
              value = pattern
            }
          }
          console.log('add subscribing',this.path)
          this._parent.subscribe(pattern, function (data, event) {
            if (this._$._output !== data.origin) {
              if (!this.hasOwnProperty('_$') && this._$._context) {
                this._$.resolveContext({}, event)
              }
              console.log('----------subscribing!',data.origin.path)
              this._$.output = data.origin
              this.emit('data', event)
            }
          }).run()
        }
      },
      operator: function (val, operator, origin) {
        var parsed = operator.parseValue(val, origin)
        var cached = objectCache.call(this, parsed)
        if (cached) {
          // events etc to these sets!
          cached.clear()
          cached.set(parsed)
          return cached
        } else {
          return parsed
        }
      }
    }),
    override: '_$'
  }
}
