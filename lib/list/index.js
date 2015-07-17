"use strict";

var Observable = require('../observable')
var Event = require('../event')

module.exports = new Observable({
  $define: {
    length: {
      value: 0,
      writable: true
    },
    $handleShifted: function(i) {
      var item = this[i]
      if(item._$parent === this) {
        item._$key = i
      } else if(item._$contextKey !== i){
        this.$createListContextGetter(i)
      }
    },
    $reset: function() {
      var base = this
      base.each(function(property, key){
        base[key] = null
        // property.$remove()
      })
      base.length = 0
    }
  },
  $inject: [
    require('./push'),
    require('./unshift'),
    require('./splice'),
    require('./sort')
  ]
}).$Constructor

