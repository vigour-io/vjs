var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')

var Event = require('../../lib/base/on/event')

var Krek = require('./krek')


var define = Object.defineProperty

//-------------------------------------------------------------

var $getPropertyValue = require('../../lib/base/set').$getPropertyValue


//-------------------------------------------------------------
console.log('\n\n\n\n---------- make list')

var list = window.list = new Base()
list._$key = 'list'

define(list, '_A_push', {
  value: Array.prototype.push
})
define(list, '$push', {
  value: function $push() {

    event = new Event()
    event.$val = arguments
    event.$origin = this

    var length = this.length

    var newValues = arguments.length
    var newLength = length + newValues

    console.error('>>>>>>>>>>>>> push', arguments, arguments.length)
    this._A_push.apply(this, arguments)    
    // var newLength = this.length
    // var newValues = newLength - length

    var i = 0

  }
})

define(list, '_A_unshift', {
  value: Array.prototype.unshift
})
define(list, '$unshift', {
  value: function $unshift(){

    event = new Event()
    event.$val = arguments
    event.$origin = this

    var length = this.length

    var newValues = arguments.length
    var newLength = length + newValues
    
    console.error('<<<<<<<<<<<<< unshift', arguments, arguments.length)
    this._A_unshift.apply(this, arguments)
    // var newLength = this.length
    // var newValues = newLength - length

    var i = 0

    if(length) {

      var newValsOldKeys = Math.min(length, newValues)
      while(i < newValsOldKeys) {
        console.warn('new value in old key bur!', i)
        this[i] = $getPropertyValue(this[i], event, this, i)
        i++
      }

      var oldValsOldKeys = length - newValues
      if(oldValsOldKeys) {
        if(oldValsOldKeys > 0) {
          while(oldValsOldKeys) {
            console.warn('old value in old key!', i)

            var item = this[i]
            if(item._$parent === this) {
              console.log('i am the parent')
              item._$key = i
            } else {
              console.log('oh noes I am context bay')
              this.$createListContextGetter(i)
            }

            i++
            oldValsOldKeys--
          }
        } else {
          while(oldValsOldKeys) {
            console.warn('new value in new key!', i)

            this[i] = $getPropertyValue(this[i], event, this, i)
            i++
            oldValsOldKeys++
          }
        }
      }

      while(i < newLength) {
        console.warn('old value in new key', i, this._$key)
        var item = this[i]

        console.log('look at item!', item)

        if(item._$parent === this) {
          console.log('i am the parent')
          item._$key = i
        } else {
          console.log('oh noes I am context bay')
          this.$createListContextGetter(i)
        }
        // this[i]._$key = i


        // if(this.hasOwnProperty( '_$Constructor' )) {
        //   console.error('dodat createContextGetter')
        //   this.$createContextGetter.call( this, String(i) )
        // }
        i++
      }

    } else {
      console.warn('all new values in all new keys!')
      while(i < newValues) {
        this.$setKeyInternal(i, this[i])
        i++
      }
    }
    
  }
})

define(list, '_A_splice', {
  value: Array.prototype.splice
})

define(list, '_A_sort', {
  value: Array.prototype.sort
})

define(list, 'length', {
  value: 0,
  enumerable: false,
  writable: true
})

console.log('=================== list.$unshift(\'shiggedy\')')
list.$unshift('addedFirstA')

console.log('-------------- list:')
list.$each(function(val, key){
  console.log(key, ':', val)
  console.log('path:', val.$path)
})
console.log('--------------')

console.log('\n\n\n\n---------- make listinstance')
var listinstance = window.listinstance = new list.$Constructor()
listinstance._$key = 'listinstance'

console.log('urrr', list[0].$parent, list[0]._$key, list[0].$key)
console.log('listinstancepath', listinstance[0].$path)

console.log('=================== listinstance.$unshift(\'shagsworn\')')
listinstance.$unshift('unshiftedthisB')

console.log('-------------- listinstance:')
listinstance.$each(function(val, key){
  console.log(key, ':', val)
  console.log('path:', val.$path)
})
console.log('--------------')

console.log('\n\n\n\n=================== look at dem!')

console.log('-------------- list:')
list.$each(function(val, key){
  console.log(key, ':', val)
  console.log('path:', val.$path)
})
console.log('--------------')

console.log('-------------- listinstance:')
listinstance.$each(function(val, key){
  console.log(key, ':', val)
  console.log('path:', val.$path)
})
console.log('--------------')

listinstance.$unshift('C1', 'C2', 'C3')

console.log('-------------- listinstance:')
listinstance.$each(function(val, key){
  console.log(key, ':', val)
  console.log('path:', val.$path)
})
console.log('--------------')

listinstance.$unshift('D1')

console.log('-------------- listinstance:')
listinstance.$each(function(val, key){
  console.log(key, ':', val)
  console.log('path:', val.$path)
})
console.log('--------------')

