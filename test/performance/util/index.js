describe('util test', function () {
  // this is buggy shit
  var util = require('../../../lib/util')
  var isNumberLike = require('../../../lib/util/is/numberlike')

  it('isNumberLike vs lodash isNumber', function (done) {
    this.timeout(50e3)
    var amount = 1e6
    var isNumber = require('lodash/lang/isNumber')

    expect(function () {
      for (var i = 0; i < amount; i++) {
        isNumberLike('a' + i)
      }
      for (i = 0; i < amount; i++) {
        isNumberLike(i)
      }
    }).performance({
      margin: 3,
      method: function () {
        for (var i = 0; i < amount; i++) {
          isNumber('a' + i)
        }
        for (i = 0; i < amount; i++) {
          isNumber(i)
        }
      }
    }, done)
  })

  it('convertToArray vs Array.prototype.slice', function (done) {
    this.timeout(50e3)
    var convertToArray = util.convertToArray
    var slice = Array.prototype.slice
    var amount = 1e6

    expect(function () {
      function fn () {
        convertToArray(arguments)
      }
      for (var i = 0; i < amount; i++) {
        fn(1, 2, 3, 4, 5, 6)
      }
    }).performance(function () {
      function fn2 () {
        slice.apply(arguments)
      }
      for (var i = 0; i < amount; i++) {
        fn2(1, 2, 3, 4, 5, 6)
      }
    }, done)
  })
})
