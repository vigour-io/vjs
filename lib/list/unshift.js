var Event = require('../base/on/event')
var A_unshift = Array.prototype.unshift

var $getPropertyValue = require('../../lib/base/set').$getPropertyValue
var $handleShifted = require('./handleshifted')

module.exports = function $unshift() {

	var event = new Event()
  event.$val = arguments
  event.$origin = this

  var newValues = arguments.length
  var oldlength = this.length
  var length = oldlength + newValues

  A_unshift.apply(this, arguments)

  for(var i = 0 ; i < length ; i++) {
    if(i < newValues) { // new value
      if(i < oldlength) { // old key
        this[i] = $getPropertyValue(this[i], event, this, i)
      } else { // new key
        this.$setKeyInternal(i, this[i])
      }
    } else { // old value
      $handleShifted(this, i)
    }
  }
}
