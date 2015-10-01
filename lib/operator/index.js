'use strict'
var Observable = require('../observable')


var obs = new Observable({
  bind: 'parent', // fix the bind -- also do for emitters (fn)
  properties: {
    operator: '_operator'
  },
  inject: [
    require('./val')
  ]
})

module.exports = obs.Constructor

obs.inject(require('./util'))
