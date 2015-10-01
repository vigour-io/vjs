'use strict'
var Observable = require('../observable')

var obs = new Observable({
  bind: 'parent', // fix the bind -- also do for emitters (fn)
  properties: {
    operator: '_operator',
    order: '_order'
  },
  inject: [
    require('./val')
  ]
})

module.exports = obs.Constructor

// this is dirty (requiring at the bottom)
obs.inject(require('./util'))
