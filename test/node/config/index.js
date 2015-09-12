// var logger = gaston.log.make('config')
// logger.enabled = true

var Config = require('../../../lib/config')

describe('Config in node.js', function(){
  var config
  it('should not crash', function(){
    config = new Config()
  })

  it('should look for package.json', function(){
    expect(config).to.have.property('name')
      .which.has.property('$val', 'vjs')
  })

  it.skip('should have vigour settings from package', function(){
    expect(config).to.have.property('vigoursetting')
      .which.has.property('$val', true)
  })

  it.skip('should resolve inline parameters', function(){
    expect(config).to.have.property('inlineparam')
      .which.has.property('$val', true)
  })
})
