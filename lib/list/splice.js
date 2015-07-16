var Event = require('../event')
var _A_splice = Array.prototype.splice
var $handleShifted = require('./handleshifted')

exports.$define = {
  $splice: function $splice( start, remove ) {
    if(!remove) {
      remove = 0
    }

    var event = new Event()
    event.$val = arguments
    event.$origin = this

    var newValues = arguments.length - 2
    var oldLength = this.length

    var maxstart = oldLength
    if(start > maxstart) {
      start = maxstart
    }

    var ret
    if( remove ) {
      var maxrem = oldLength - start
      if(remove > maxrem) {
        remove = maxrem
      }

      if( remove === 1 ) {
        ret = [this[start]]
      } else {
        ret = []
        for( var i = start, n = remove ; n ; n-- && i++ ) {
          var item = this[i]
          ret.push(this[i])
        }
      }
    }

    _A_splice.apply( this, arguments )

    var length = this.length

    var newValsOldKeys = Math.min(newValues, oldLength-start)
    var newValsMaxKey = start + newValues
    var olValsMaxKey = oldLength - start - remove

    var i = Math.min(start, oldLength)

    while(i < newValsMaxKey) {
      this[i] = this.$getPropertyValue(this[i], event, this, i)
      i++
    }

    while(i < length) {
      $handleShifted(this, i)
      i++
    }
    
    if(ret) {
      for(var i = 0, l = ret.length ; i < l ; i++) {
        // ret[i].remove(event)
        // console.warn('remove!')
      }
      return ret
    }  
  }
}
