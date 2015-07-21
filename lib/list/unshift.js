var Event = require('../event')
var A_unshift = Array.prototype.unshift
var $handleShifted = require('./handleshifted')

exports.$define = {
  $unshift: function $unshift() {

  	var event = new Event( this )
    event.$val = arguments

    var newValues = arguments.length
    var oldlength = this.length
    var length = oldlength + newValues

    A_unshift.apply(this, arguments)

    for(var i = 0 ; i < length ; i++) {
      if(i < newValues) { // new value
        if(i < oldlength) { // old key
          this[i] = this.$getPropertyValue( this[i], event, this, i )
        } else { // new key
          this.$setKeyInternal(i, this[i])
        }
      } else { // old value
        $handleShifted(this, i)
      }
    }
  }
}
