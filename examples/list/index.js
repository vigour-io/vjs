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

    var ret
    if(remove) {
      if(remove === 1) {
        ret = [this[start]]
      } else {
        ret = []
        for(var i = start, n = remove ; n ; n-- && i++ ) {
          ret.push(this[i])
        }
      }
    }

    var newValues = arguments.length - 2
    var length = this.length
    
    // console.error('<<>><<>><<>>< splice', arguments, arguments.length)
    _A_splice.apply(this, arguments)

    var i = Math.min(start, length)

    var newValsOldKeys = Math.min(newValues, length-start)

    while(newValsOldKeys) {
      // console.warn('new value in old key', i)
      this[i] = $getPropertyValue(this[i], event, this, i)
      i++
      newValsOldKeys--
    }

    var newValsNewKeys = start + newValues - length

    if(newValsNewKeys > 0) {
      while(newValsNewKeys) {
        // console.warn('new value in new key', i)
        this[i] = $getPropertyValue(this[i], event, this, i)
        i++
        newValsNewKeys--
      }
    } else if(newValues > remove){

      var oldValsOldKeys = -newValsNewKeys - remove
      newValsNewKeys = 0
      // console.log('oldValsOldKeys',oldValsOldKeys, newValsNewKeys, oldValsOldKeys, remove)
      while(oldValsOldKeys) {
        // console.warn('old value in old key', i)
        var item = this[i]
        if(item._$parent === this) {
          // console.log('i am the parent')
          item._$key = i
        } else {
          // console.log('oh noes I am context bay')
          this.$createListContextGetter(i)
        }
        i++
        oldValsOldKeys--
      }
        

    }

    if(length) {
      var oldValsNewKeys = newValues - newValsNewKeys - remove
      if(oldValsNewKeys > 0) {
        while(oldValsNewKeys) {
          // console.warn('old value in new key', i)
          var item = this[i]
          if(item._$parent === this) {
            // console.log('i am the parent')
            item._$key = i
          } else {
            // console.log('oh noes I am context bay')
            this.$createListContextGetter(i)
          }
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

    var ret
    if(remove) {
      if(remove === 1) {
        ret = [this[start]]
      } else {
        ret = []
        for(var i = start, n = remove ; n ; n-- && i++ ) {
          ret.push(this[i])
        }
      }
    }

    var newValues = arguments.length - 2
    var length = this.length
    
    // console.error('<<>><<>><<>>< splice', arguments, arguments.length)
    _A_splice.apply(this, arguments)

    var i = Math.min(start, length)

    var newValsOldKeys = Math.min(newValues, length-start)

    while(newValsOldKeys) {
      // console.warn('new value in old key', i)
      this[i] = $getPropertyValue(this[i], event, this, i)
      i++
      newValsOldKeys--
    }

    var newValsNewKeys = start + newValues - length

    if(newValsNewKeys > 0) {
      while(newValsNewKeys) {
        // console.warn('new value in new key', i)
        this[i] = $getPropertyValue(this[i], event, this, i)
        i++
        newValsNewKeys--
      }
    } else if(newValues > remove){

      var oldValsOldKeys = -newValsNewKeys - remove
      newValsNewKeys = 0
      // console.log('oldValsOldKeys',oldValsOldKeys, newValsNewKeys, oldValsOldKeys, remove)
      while(oldValsOldKeys) {
        // console.warn('old value in old key', i)
        var item = this[i]
        if(item._$parent === this) {
          // console.log('i am the parent')
          item._$key = i
        } else {
          // console.log('oh noes I am context bay')
          this.$createListContextGetter(i)
        }
        i++
        oldValsOldKeys--
      }
        

    }

    if(length) {
      var oldValsNewKeys = newValues - newValsNewKeys - remove
      if(oldValsNewKeys > 0) {
        while(oldValsNewKeys) {
          // console.warn('old value in new key', i)
          var item = this[i]
          if(item._$parent === this) {
            // console.log('i am the parent')
            item._$key = i
          } else {
            // console.log('oh noes I am context bay')
            this.$createListContextGetter(i)
          }
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

var n = 10

// var l5 = new list.$Constructor()

perf({
  log: console.log.bind(console),
  name: 'splice',
  method: function() {
    for(var i = 0 ; i < n ; i++) {
      list1.$splice(3, 2, 'wexfleps', 'HEPSKABATS', 'flieperdieflap')
    }
  },
  // loop: 12
})


perf({
  log: console.log.bind(console),
  name: 'splice2',
  method: function(){
    for(var i = 0 ; i < n ; i++) {
      list2.$splice2(3, 2, 'wexfleps', 'HEPSKABATS', 'flieperdieflap')
    }
  },
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