describe( 'util test', function() {

  console.clear()
  //this is buggy shit
  var Base = require('../../../lib/base')
  var util = require('../../../lib/util')

  it('convertToArray vs Array.prototype.slice', function( done ) {
    this.timeout(5000)
    var convertToArray = util.convertToArray
    var slice = Array.prototype.slice
    var amount = 1000e3

    expect( function() {
      function fn() {
        var arr = convertToArray(arguments)
      }
      for(var i = 0; i < amount; i++ ) {
        fn(1,2,3,4,5,6)
      }
    }).performance( function() {
      function fn2() {
        var arr = slice.apply( arguments )
      }
      for(var i = 0; i < amount; i++ ) {
        fn2(1,2,3,4,5,6)
      }
    }, done )
  })

})
