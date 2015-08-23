var Event = require('../event')
var _A_splice = Array.prototype.splice
var $handleShifted = require('./handleshifted')

exports.$define = {
  $splice: function $splice( start, remove ) {
    if(!remove) {
      remove = 0
    }
    console.group()
    var al = arguments.length
    var newValues = al - 2
    var oldLength = this.length

    var event = arguments[al-1]

    if(event === null || event instanceof Event) {
      arguments.length--
      newValues--
    } else {
      event = new Event( this )
      event.$val = arguments
    }

    var maxstart = oldLength
    if(start > maxstart) {
      start = maxstart
    }

    var removedItems
    if( remove ) {
      var maxrem = oldLength - start
      if(remove > maxrem) {
        remove = maxrem
      }

      if( remove === 1 ) {
        removedItems = [this[start]]
      } else {
        removedItems = []
        for( var i = start, n = remove ; n ; n-- && i++ ) {
          var item = this[i]
          removedItems.push(this[i])
        }
      }
    }

    _A_splice.apply( this, arguments )

    var length = this.length

    var newValsOldKeys = Math.min(newValues, oldLength-start)
    var newValsMaxKey = start + newValues
    var olValsMaxKey = oldLength - start - remove

    var i = Math.min(start, oldLength)
    var delta = {}
    if(i < newValsMaxKey) {
      delta.changed = []
      while(i < newValsMaxKey) {
        this[i] = this.$getPropertyValue(this[i], event, this, i)
        delta.changed.push(i)
        i++
      }
    }
    
    var shift = remove - newValues


    if(i < length) {
      var moved = delta.moved = {}
      while(i < length) {   
        $handleShifted(this, i)
        moved[i] = i+shift
        if(i >= oldLength) {
          var added = delta.added || (delta.added = [])
          added.push(i)
        }
        i++
      }
    }

    if(shift > 0) {
      delta.removed = []
      while(shift--) {
        delta.removed.push(i++)
      }
    }

    if(removedItems) {
      for(var i = 0, l = removedItems.length ; i < l ; i++) {
        removedItems[i].remove(event, false, true)
        // console.warn('remove!')
      }
    }

    // console.log('splice emitting', delta)
    // var _emit = this.emit
    // this.define({
    //   emit: function(){

    //   }
    // })

    console.groupEnd()

    // console.log('-------------- AM I ORIGIN', event.$origin === this)

    // console.warn('>>1', event.toString(), this.$path)

    this.emit('$property', event, delta)

    // console.warn('>>2', event.toString(), this.$path)

    // console.error( this.$on )

    this.emit('$change', event)

    

    // console.warn('>>3', event.toString(), this.$path)


    return removedItems
  }
}
