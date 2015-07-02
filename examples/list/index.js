var perf = require('../../lib/dev/perf')
var log = require('../../lib/dev/log')

var Base = require('../../lib/base')

var Event = require('../../lib/base/on/event')

var Krek = require('./krek')


var define = Object.defineProperty

// var first = new Base({
//   key1: 1
// })
// first._$key = 'first'


// var second = new first.$Constructor({
//   key2: 2
// })
// second._$key = 'second'


// console.log('?', second.key1.$path)

// var arr = [new Base('A'), new Base('A')]

// arr.unshift(new Base('B'))

// for(var i in arr) {
//   console.log('i', arr[i])
// }


// var burk = {}

// define(burk, 'unshift', {
//   value: Array.prototype.unshift
// })

// burk.normalkey1 = 1

// define(burk, 'getterkey2', {
//   get: function() {
//     console.log('GET getterkey2')
//     return new Base('???')
//   },
//   set: function() {
//     console.log('SET getterkey2')
//   },
//   enumerable: true
// })

// burk.unshift('????')

// for(var f in burk) {
//   console.log('FIELD', f)
// }







var Shurk = function Shurk() {
  this.shurk = true
}

// console.log('?!', Shurk.prototype)

// Shurk.prototype.__proto__ = new Array()

// var shurk = new Shurk()

// console.log('shurk shurk instanceof Shurk', shurk instanceof Shurk)
// console.log('shurk shurk instanceof Array', shurk instanceof Array)

// shurk.unshift('hehehaha')

// console.log('shurk:', shurk)

// for(var i in shurk) {
//   console.log('key in shurk', i, shurk[i])
// }

// throw 'stop!'




//-------------------------------------------------------------
console.log('\n\n\n\n---------- make list')

var list = window.list = new Base()
list._$key = 'list'

define(list, '_A_push', {
  value: Array.prototype.push
})
define(list, '$push', {
  value: function $push() {

  }
})

var STATUS = 0

define(list, '_A_unshift', {
  value: Array.prototype.unshift
})
define(list, '$unshift', {
  value: function $unshift(){

    event = new Event()
    event.$val = arguments
    event.$origin = this

    console.log('unshift!')

    // var fixgetters = this.hasOwnProperty('_$Constructor')

    var length = this.length

    if(STATUS === 1) {
      console.log('--- about to unshift into', this._$key)
      this.$each(function(value, key){
        console.log('--- key', key)
      })
    }

    this._A_unshift.apply(this, arguments)

    var newLength = this.length
    var newValues = newLength - length

    var i = 0

    if(length) {

      var newValsOldKeys = Math.min(length, newValues)
      while(i < newValsOldKeys) {
        console.log('new value in old key bur!', i)
        i++

        // this[i] = new this.$ChildConstructor( this[i], event, this, i )


      }

      var oldValsOldKeys = length - newValues
      if(oldValsOldKeys) {
        if(oldValsOldKeys > 0) {
          while(oldValsOldKeys) {
            console.log('old value in old key!', i)
            i++
            oldValsOldKeys--
          }
        } else {
          while(oldValsOldKeys) {
            console.log('new value in new key!', i)
            i++
            oldValsOldKeys++
          }
        }
      }

      while(i < newLength) {
        console.log('old value in new key', i)
        i++
      }

    } else {
      console.log('all new values in all new keys!')


      while(i < newValues) {


        // console.log('?E', this.hasOwnProperty( '_$Constructor' ))

        // this[i] = {lurkwex: 1}
        console.log('SET DAT KEY!!!')
        var childburk = new this.$ChildConstructor( this[i], event, this, i )

        console.log('?!?!?! WEXEEEE', i)

        this[i] = new Base(1)

        // this.$setKeyInternal(i, this[i])

        i++
      }
    }
    


    // for(var i = 0 ; i < newValues ; i++) {
    //   // var value = this[i]
    //   console.log('unshifted!', i, this[i])
    //   this.$setKeyInternal(i, this[i])
    // }
    // if(length) {

    //   var 

    // }
    // for(; i < length ; i++) {
    //   console.log('this field was there')  
    // }

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
})
console.log('--------------')

console.log('\n\n\n\n---------- make listinstance')
var listinstance = window.listinstance = new list.$Constructor()
listinstance._$key = 'listinstance'

STATUS = 1
console.log('=================== listinstance.$unshift(\'shagsworn\')')
listinstance.$unshift('unshiftedthisB')

console.log('-------------- listinstance:')
listinstance.$each(function(val, key){
  console.log(key, ':', val)
})
console.log('--------------')

console.log('\n\n\n\n=================== look at dem!')

console.log('-------------- list:')
list.$each(function(val, key){
  console.log(key, ':', val)
})
console.log('--------------')

console.log('-------------- listinstance:')
listinstance.$each(function(val, key){
  console.log(key, ':', val)
})

listinstance[111]=1
listinstance[12]=1


listinstance['lep']=1
define(listinstance, 'swex', {
  get: function() {

  },
  set: function() {

  },
  enumerable: true
})
listinstance.zep = 1
listinstance.aep = 1




for(var f in listinstance) {
  console.log('KEY:', f)
}

console.log('--------------')


// list.$$unshift('shine')
// list.$$unshift('durk', 'smurk', 'sjeisk')

// list.$$splice(2,0,'GESPLICED')

// console.log('-------------- list:')
// list.$each(function(val, key){
//   console.log(key, ':', val)
// })
// console.log('--------------')

// list.$$ArraySort()

// console.log('-------------- list:')
// list.$each(function(val, key){
//   console.log(key, ':', val)
// })
// console.log('--------------')