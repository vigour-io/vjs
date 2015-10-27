'use strict'
var Base = require('../../../base')

exports.properties = {
  pattern: new Base({
    define: {
      each (fn) {
        var ret
        for (var i in this) {
          if (i[0] !== '_' && i !== 'key') {
            ret = fn.call(this, this[i], i)
            if (ret) {
              return ret
            }
          }
        }
      }
    },
    ChildConstructor: 'Constructor'
  }).Constructor
}
