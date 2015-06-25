var log = require('../../lib/dev/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

var ding1 = new Base({
  path: {
    naar: {
      iets: 1
    }
  },
  $add: {
    addthiskey: 'addthisvalue',
    alsoaddthis: 'alsoaddedthis'
  },
  // $map: function(property, key) {
  //   console.log('hurwex', key)
  //   var setobj = {}
  //   setobj[key] = 'ha mapped this!' + Math.random()
  //   return Math.random()
  // }
  // $map: function(property, key){
  //   console.log('key', property._$key, key)
  // }
})

console.log('========================== 1')
console.log('got dat', ding1.$toString())
console.log('==========================')  

var got = ding1.$val

console.log('========================== 2')
console.log('got dat', got.$toString())
console.log('==========================')

console.log('whats in got', got.path.$toString())

var t1 = new Base(1)

var t2 = new Base(t1)



console.log('normal ref?', t2.$toString())


