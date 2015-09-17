var Base = require('../../../lib/base')

describe('output', function() {
  it('overwrite input', function(){
    var a = new Base({
      $val:20,
      $output:30
    })
    expect(a.$val).to.equal(30)
  })
})
