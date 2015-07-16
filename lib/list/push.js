var push = Array.prototype.push
var Event = require('../event')

exports.$define = {
  $push: function $push() {

    var event = new Event()
    event.$val = arguments
    event.$origin = this

    var oldLength = this.length
    var newValues = arguments.length
    var newLength = oldLength + newValues

    push.apply(this, arguments)

    for(var i = oldLength ; i < newLength ; i++) {
      this.$setKeyInternal(i, this[i])
    }
  }
}
