'use strict'
var Operator = require('./')
var objectCache = require('./cache/object')
exports.inject = require('./val')
exports.properties = {
  $: function (pattern) {
    if (typeof pattern === 'string') {
      let keys
      let value = true
      if (~pattern.indexOf('/')) {
        keys = pattern.split('/')
        for (let i = keys.length - 1; i >= 0; i--) {
          let key = keys[i]
          if (key === '..') {
            key = 'parent'
          } else if (key === '...') {
            key = 'upward'
          }
          pattern = {}
          pattern[key] = value
          value = pattern
        }
      } else {
        keys = pattern.split('.')
        for (let i = keys.length - 1; i >= 0; i--) {
          let key = keys[i]
          pattern = {}
          pattern[key] = value
          value = pattern
        }
      }
    }
    this.setKey('$subscribe')
    this.subscribe(pattern, function (data, event) {
      var $subscribe = this.$subscribe
      // This should not be nessecary, is it removed?
      $subscribe.set(data.origin)
    }).run()
  },
  $subscribe: new Operator({
    key: '$subscribe',
    operator: function (val, operator, origin) {
      var parsed = operator.parseValue(val, origin)
      var cached = objectCache.call(this, parsed)
      console.log('subscribe!')
      console.log('parsed', parsed)
      console.log('cached', cached)
      if (cached) {
        // events etc to these sets!
        cached.clear()
        cached.set(parsed)
        return cached
      } else {
        return parsed
      }
    }
  })
}
