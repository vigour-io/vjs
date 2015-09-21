var Observable = require('../../../../../../lib/observable')
var subcription
var count
var instance

beforeEach(function () {
  count = 0
})

describe('subscribing to same parent with multiple instances', function () {
  var a = new Observable({
    $key: 'a'
  })

  it('subcribes to field', function () {
    subcription = a.subscribe({
      $parent: true
    }, function () {
      instance = this
      count++
    })
  })

  var b = new a.$Constructor({
    $key: 'b'
  })

  it('fires on instance', function () {
    var parent = new Observable({
      a: {$useVal: a},
      b: {$useVal: b},
      c: {$useVal: new b.$Constructor()}
    })
  // expect(count).equals(1)
  // expect(instance.$key).equals('b')
  })

})
