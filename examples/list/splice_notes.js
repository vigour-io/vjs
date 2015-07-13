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
    var length = this.length

    var ret
    if(remove) {
      var maxrem = length - start
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

    var i = Math.min(start, length)
    // console.log('ik ga beginnen bij', i)
    var newValsOldKeys = Math.min(newValues, length-start)

    while(newValsOldKeys) {
      // console.warn('new value in old key', i)
      this[i] = $getPropertyValue(this[i], event, this, i)
      i++
      newValsOldKeys--
    }

    var newValsNewKeys = start + newValues - length

    // console.log('newValsNewKeys', newValsNewKeys)
    // console.log('start', start)
    // console.log('newValsOldKeys', newValsOldKeys)
    // console.log('length', length)

    if(newValsNewKeys > 0) {
      var j = newValsNewKeys
      while(j) {
        // console.warn('new value in new key', i)
        this[i] = $getPropertyValue(this[i], event, this, i)
        i++
        j--
      }
    } else if(newValues < remove){

      var oldValsOldKeys = -newValsNewKeys - remove
      newValsNewKeys = 0
      // console.log('oldValsOldKeys',oldValsOldKeys, newValsNewKeys, oldValsOldKeys, remove)

      var j = oldValsOldKeys

      while(j) {
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
        j--
      }

    }


    if(length && start < length) {
      var oldValsNewKeys = newValues - newValsNewKeys - remove

      // console.log('oldValsNewKeys', oldValsNewKeys)
      // console.log('newValues', newValues)
      // console.log('newValsNewKeys', newValsNewKeys)
      // console.log('remove', remove)

      if(oldValsNewKeys > 0) {
        while(oldValsNewKeys) {
          // console.warn('old value in new key', i, this)

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

    var newValues = arguments.length - 2
    var length = this.length

    var ret
    if(remove) {
      var maxrem = length - start
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

    var i = Math.min(start, length)
    // console.log('ik ga beginnen bij', i)
    var newValsOldKeys = Math.min(newValues, length-start)

    while(newValsOldKeys) {
      // console.warn('new value in old key', i)
      this[i] = $getPropertyValue(this[i], event, this, i)
      i++
      newValsOldKeys--
    }

    var newValsNewKeys = start + newValues - length

    // console.log('newValsNewKeys', newValsNewKeys)
    // console.log('start', start)
    // console.log('newValsOldKeys', newValsOldKeys)
    // console.log('length', length)

    if(newValsNewKeys > 0) {
      var j = newValsNewKeys
      while(j) {
        // console.warn('new value in new key', i)
        this[i] = $getPropertyValue(this[i], event, this, i)
        i++
        j--
      }
    } else if(newValues < remove){

      var oldValsOldKeys = -newValsNewKeys - remove
      newValsNewKeys = 0
      // console.log('oldValsOldKeys',oldValsOldKeys, newValsNewKeys, oldValsOldKeys, remove)

      var j = oldValsOldKeys

      while(j) {
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
        j--
      }

    }


    if(length && start < length) {
      var oldValsNewKeys = newValues - newValsNewKeys - remove

      // console.log('oldValsNewKeys', oldValsNewKeys)
      // console.log('newValues', newValues)
      // console.log('newValsNewKeys', newValsNewKeys)
      // console.log('remove', remove)

      if(oldValsNewKeys > 0) {
        while(oldValsNewKeys) {
          // console.warn('old value in new key', i, this)

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
      list1.$splice(1, 1, 'wexfleps', 'HEPSKABATS', 'flieperdieflap')
    }
  },
  // loop: 12
})

perf({
  log: console.log.bind(console),
  name: 'splice2',
  method: function(){
    for(var i = 0 ; i < n ; i++) {
      list2.$splice2(1, 1, 'wexfleps', 'HEPSKABATS', 'flieperdieflap')
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