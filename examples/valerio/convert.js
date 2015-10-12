var Base = require('../../lib/base')
Base.prototype.inject(
  require('../../lib/methods/convert')
)

var myObj = new Base({
  key: 'a',
  x: {
    y: 123
  },
  properties: {
    z: '$z'
  },
  z: 'zContent'
})

console.log('Plain', myObj.plain())
console.log('Plain filtered', myObj.plain(function (val, key) {
  if (key === 'y') {
    return false
  }
  return true
}))
console.log('Convert plain', myObj.convert({
  plain: true
}))
console.log('Convert plain filtered', myObj.convert({
  plain: true,
  filter: function (val, key) {
    if (key === 'y') {
      return false
    }
    return true
  }
}))
console.log('Flatten', myObj.flatten())
console.log('Convert flatten', myObj.convert({flatten: true}))
