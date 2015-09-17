var push = Array.prototype.push
var Event = require('../event')

exports.$define = {
  $push: function $push() {

    var newValues = arguments.length

    var event = arguments[newValues-1]

    if(event !== null && !(event instanceof Event)) {
      event = new Event( this )
      event.$val = arguments
    } else {
      arguments.length--
      newValues--
    }

    var oldLength = this.length
    var newLength = oldLength + newValues

    push.apply(this, arguments)

    for(var i = oldLength ; i < newLength ; i++) {
      // console.log('========= push: $setKeyInternal', this[i])      
      this.$setKeyInternal(i, this[i], false, event)
    }
  }
}
