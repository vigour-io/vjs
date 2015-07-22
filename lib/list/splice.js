var Event = require('../event')
var _A_splice = Array.prototype.splice
var $handleShifted = require('./handleshifted')

exports.$define = {
  $splice: function $splice( start, remove ) {
    if(!remove) {
      remove = 0
    }

    var al = arguments.length
    var newValues = al - 2
    var oldLength = this.length

    var event = arguments[al-1]
    if(event instanceof Event) {
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
      if(i + 1 === newValsMaxKey) {
        delta.changed = i
        this[i] = this.$getPropertyValue(this[i], event, this, i)
        i++
      } else {
        delta.changed = []
        while(i < newValsMaxKey) {
          this[i] = this.$getPropertyValue(this[i], event, this, i)
          console.log('change!', i)
          delta.changed.push(i)
          i++
        }    
      }
      
    }
    
    var shift = remove - newValues
    
    console.log('i', i, 'length', length)
    if(i < length) {
      var moved = delta.moved = {}
      while(i < length) {   
        $handleShifted(this, i)
        moved[i+shift] = i
        if(i >= oldLength) {
          var added = delta.added
          if(added === void 0) {
            delta.added = i
          } else if(added instanceof Array){
            added.push(i)
          } else {
            added = [added, i]
          }
        }
        i++
      }
    }

    if(shift > 0) {
      if(shift > 1) {
        delta.removed = []
        while(shift--) {
          delta.removed.push(i++)
        }
      } else {
        delta.removed = i
      }
    }

    if(removedItems) {
      for(var i = 0, l = removedItems.length ; i < l ; i++) {
        // removedItems[i].remove(event)
        // console.warn('remove!')
      }
    }
    console.log('?E?E?E emitting', delta)

    this.$emit('$property', event, delta)
    this.$emit('$change', event)


    return removedItems
  }
}
