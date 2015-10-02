var Base = require('../../lib/base')

var a = new Base()

var aBase = new Base({
  blurf: true
})

a.set({
  key: 'a',
  jim: {
    valerio: 'xxx'
  },
  properties: {
    hello: '$hello',
    second: true,
    third: aBase
  },
  hello: 'this is the hello field',
  second: 13123,
  third: 'xxxxxx'
})

// converting it to plain is not working for the custom field

console.log(a.$hello)
console.log(a.second)
console.log(a.third.val)

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