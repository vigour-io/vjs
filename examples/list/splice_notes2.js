var define = Object.defineProperty

var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')
var Event = require('../../lib/base/on/event')
var Krek = require('./krek')

var List = require('../../lib/list')

//-------------------------------------------------------------

var $getPropertyValue = require('../../lib/base/set').$getPropertyValue
var $handleShifted = require('../../lib/list/handleshifted')

//-------------------------------------------------------------

console.log('\n\n\n\n---------- make list')

var list = List.prototype

var _A_splice = Array.prototype.splice

define(list, '$splice', {
  value: function $splice(start, remove) {
    if(!remove) remove = 0

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
    if(remove) {
      var maxrem = oldLength - start
      if(remove > maxrem) {
        remove = maxrem
      }

      if(remove === 1) {
        ret = [this[start]]
      } else {
        ret = []
        for(var i = start, n = remove ; n ; n-- && i++ ) {
          var item = this[i]
          ret.push(this[i])
        }
      }
    }

    _A_splice.apply(this, arguments)

    var i = Math.min(start, oldLength)

    var newValsOldKeys = Math.min(newValues, oldLength-start)

    while(newValsOldKeys) {
      this[i] = $getPropertyValue(this[i], event, this, i)
      i++
      newValsOldKeys--
    }

    var newValsNewKeys = start + newValues - oldLength

    if(newValsNewKeys > 0) {
      var j = newValsNewKeys
      while(j) {
        this[i] = $getPropertyValue(this[i], event, this, i)
        i++
        j--
      }
    } else if(newValues < remove){

      var oldValsOldKeys = -newValsNewKeys - remove
      newValsNewKeys = 0

      var j = oldValsOldKeys

      while(j) {
        $handleShifted(this, i)
        j--
      }

    }


    if(oldLength && start < oldLength) {
      var oldValsNewKeys = newValues - newValsNewKeys - remove

      if(oldValsNewKeys > 0) {
        while(oldValsNewKeys) {
          $handleShifted(this, i)
          i++
          oldValsNewKeys--
        }  
      }
    }

    if(ret) {
      for(var i = 0, l = ret.length ; i < l ; i++) {
        // ret[i].remove(event)
        // console.warn('remove!')
      }
      return ret
    }

  }
})


define(list, '$splice2', {
  value: function $splice(start, remove) {
if(!remove) remove = 0

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
    if(remove) {
      var maxrem = oldLength - start
      if(remove > maxrem) {
        remove = maxrem
      }

      if(remove === 1) {
        ret = [this[start]]
      } else {
        ret = []
        for(var i = start, n = remove ; n ; n-- && i++ ) {
          var item = this[i]
          ret.push(this[i])
        }
      }
    }

    // console.error('<<>><<>><<>>< splice', arguments, arguments.length)
    // console.log('this', this.$toString())
    _A_splice.apply(this, arguments)

    // console.log('wext', this)

    var length = this.length

    var newValsOldKeys = Math.min(newValues, oldLength-start)
    var newValsMaxKey = start + newValues
    var olValsMaxKey = oldLength - start - remove

    for(var i = Math.min(start, oldLength) ; i < length ; i++) {
      if(i < newValsMaxKey) {
        // console.log('new value!', this[i], i)
        this[i] = $getPropertyValue(this[i], event, this, i)
        // console.log('new value!', this[i])
      } else{
        $handleShifted(this, i)
      }

    }

    if(ret) {
      for(var i = 0, l = ret.length ; i < l ; i++) {
        // ret[i].remove(event)
        // console.warn('remove!')
      }
      return ret
    }

  }
})


define(list, '$splice3', {
  value: function $splice(start, remove) {
    if(!remove) remove = 0

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
    if(remove) {
      var maxrem = oldLength - start
      if(remove > maxrem) {
        remove = maxrem
      }

      if(remove === 1) {
        ret = [this[start]]
      } else {
        ret = []
        for(var i = start, n = remove ; n ; n-- && i++ ) {
          var item = this[i]
          ret.push(this[i])
        }
      }
    }

    _A_splice.apply(this, arguments)

    var length = this.length

    var newValsOldKeys = Math.min(newValues, oldLength-start)
    var newValsMaxKey = start + newValues
    var olValsMaxKey = oldLength - start - remove

    var i = Math.min(start, oldLength)

    while(i < newValsMaxKey) {
      this[i] = $getPropertyValue(this[i], event, this, i)
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
})

define(list, '_A_sort', {
  value: Array.prototype.sort
})

define(list, 'length', {
  value: 0,
  enumerable: false,
  writable: true
})


// =============================================================

var list1 = window.list1 = new List()

list1._$key = 'list1'

list1.$unshift('A', 'A', 'A')

list1.$splice(1,1,'SPLICED')

console.log('-------------- list1:')
list1.$each(function(value, key){
  console.log('>', key, value, '\n', value.$path)
})

var list2 = window.list2 = new List()
list2._$key = 'list2'

list2.$unshift('A', 'A', 'A')

list2.$splice2(1,1,'SPLICED')

console.log('-------------- list2:')
list2.$each(function(value, key){
  console.log('>', key, value, '\n', value.$path)
})

// =============================================================

// throw 'stop'

var n = 150
var loop = 500
// var l5 = new list.$Constructor()

perf({
  log: console.log.bind(console),
  name: 'splice',
  method: function() {
    var list1 = new List()
    for(var i = 0 ; i < n ; i++) {
      list1.$splice(1, 1, 'wexfleps', 'HEPSKABATS', 'flieperdieflap')
    }
  },
  loop: loop
})

perf({
  log: console.log.bind(console),
  name: 'splice2',
  method: function(){
    var list2 = new List()
    for(var i = 0 ; i < n ; i++) {
      list2.$splice2(1, 1, 'wexfleps', 'HEPSKABATS', 'flieperdieflap')
    }
  },
  loop: loop
})

var list3 = new List()
list3.$unshift('A', 'A', 'A')
list3.$splice2(1,1,'SPLICED')
console.log('?!!?')

perf({
  log: console.log.bind(console),
  name: 'splice3',
  method: function(){
    var list3 = new List()
    for(var i = 0 ; i < n ; i++) {
      list3.$splice3(1, 1, 'wexfleps', 'HEPSKABATS', 'flieperdieflap')
    }
  },
  loop: loop
  // loop: 12
})


var durk = new List()
perf({
  log: console.log.bind(console),
  name: 'unshift??',
  method: function(){
    for(var i = 0 ; i < n ; i++) {
      durk.$unshift('wexfleps')
    }
  },
  // loop: 12
})