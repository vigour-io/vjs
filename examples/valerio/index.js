var Base = require('../../lib/base')
Base.prototype.inject(require('../../lib/methods/toString'))

var a = new Base()

var aBase = new Base({
  blurf: 'ablurffield',
  x: {
    y: {
      z: true
    }
  }
})

a.set({
  key: 'a',
  jim: {
    valerio: 'xxx'
  },
  properties: {
    hello: '$hello',
    second: { val: 122333 },
    third: aBase,
    valerio: function(val) {
      console.log('---valerio--->', val)
    },
    4: { val: aBase, override: '_four' },
    bla: { val: 'xxxx' }
  },
  hello: 'this is the hello field',
  third: {
    x: { y: { z: 'hahaha'} }
  },
  4: 'haha'
})

console.log(Object.keys(a))


// converting it to plain is not working for the custom field

console.log(a.$hello)
console.log(a.second)

a.setKey('valerio', 'hey!')

console.log('3', a.third.blurf === aBase.blurf, aBase.x.y.z.val, a.third.x.y.z.val)




console.log(a.toString())


// a.jim.valerio.getRoot()

// console.log(a.convert({plain:true, string:true}))

var b  = new a.Constructor({
  key: 'b',
  jim: {
    blurf: true
  }
})

// b.jim.valerio.getRoot()


console.log(b.jim.valerio.path, b.jim.valerio === a.jim.valerio)
b.jim.val = { hello: true }

// b --> get jim it will check is jim my own prop? no --> set context for jim on b with contextLevel 1
// b.jim.valerio  do i have context? yes allright use context contextLevel = 2
console.log(b.jim.valerio._path, b.jim instanceof a.jim.Constructor)
