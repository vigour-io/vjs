var define = Object.defineProperty

var Base = require('../base')
var Event = require('../base/on/event')

var $getPropertyValue = require('../../lib/base/set').$getPropertyValue

var list = window.list = new Base()

// -------------------------------- length
define(list, 'length', {
  value: 0,
  enumerable: false,
  writable: true
})

define(list, '$set', {
  value: function(val, event) {
    console.log('lol set on list', val)



  }
})

// -------------------------------- $handleShifted
define(list, '$handleShifted', {
  value: function(i) {
    var item = this[i]
	  if(item._$parent === this) {
	    item._$key = i
	  } else if(item._$contextKey !== i){
	    this.$createListContextGetter(i)
	  }
  }
})

// -------------------------------- $reset
define(list, '$reset', {
  value: function() {
    var base = this
    base.$each(function(property, key){
      base[key] = null
      // property.$remove()
    })
    base.length = 0
  }
})

// -------------------------------- $push
define(list, '$push', {
  value: require('./push')
})

// -------------------------------- $unshift
define(list, '$unshift', {
  value: require('./unshift')
})

// -------------------------------- $splice
define(list, '$splice', {
  value: require('./splice')
})

// -------------------------------- $sort
define(list, '$$sort', {
  value: require('./sort')
})


module.exports = list.$Constructor
