var _A_push = Array.prototype.push

var Event = require('../base/on/event')

module.exports = function $push() {

  var event = new Event()
  event.$val = arguments
  event.$origin = this

  var oldLength = this.length

  var newValues = arguments.length
  var newLength = length + newValues

  // console.error('>>>>>>>>>>>>> push', arguments, arguments.length)
  _A_push.apply(this, arguments)
  
  for(var i = oldLength ; i < newLength ; i++) {
    this.$setKeyInternal(i, this[i])
  }

}
