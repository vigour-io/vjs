var chai = window.chai
var describe = window.describe
var it = window.it
var expect = chai.expect
var should = chai.should()

chai.use(function (_chai, _ ) {
  _chai.Assertion.addMethod('msg', function (msg) {
    _.flag(this, 'message', msg)
  })
})

exports.chai = chai
exports.it = it
exports.describe = describe
exports.should = should
exports.expect = expect
