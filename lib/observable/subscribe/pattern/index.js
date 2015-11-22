'use strict'
var Base = require('../../../base')

exports.properties = {
  pattern: new Base({
    define: {
      each (fn) {
        for (var i in this) {
          if (i[0] !== '_' && i !== 'key') {
            let ret = fn.call(this, this[i], i)
            if (ret) return ret
          }
        }
      }
    },
    inject: require('../id'),
    ChildConstructor: 'Constructor'
  }).Constructor
}
