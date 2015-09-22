/* global expect, it, describe, beforeEach */
var Observable = require('../../../../../../lib/observable')
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
    a.subscribe({
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
    new Observable({
      a: {$useVal: a},
      b: {$useVal: b}
    })
    expect(count).equals(2)
    expect(instance.$key).equals('b')
  })
})
