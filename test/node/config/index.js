/* global describe, it, expect */
// the above shouldn't be necessary, but apparently there is a problem with the js-standard linter...

var Config = require('../../../lib/config')

describe('Config in node.js', function () {
  var config
  it('should not crash', function () {
    config = new Config({
      _packageDir: __dirname
    })
  })

  it('should look for package.json at the location specified by `_packageDir`', function () {
    expect(config).to.have.property('name')
      .which.has.property('val', 'config')
  })

  it('should look for package.json in the current working directory if `_packageDir` is not provided', function () {
    var configTwo = new Config()
    expect(configTwo).to.have.property('name')
      .which.has.property('val', 'vjs')
  })

  it('should have vigour settings from package', function () {
    expect(config).to.have.property('vigoursetting')
      .which.has.property('val', true)
  })

  it.skip('should resolve inline parameters', function () {
    expect(config).to.have.property('inlineparam')
      .which.has.property('val', true)
  })
})
