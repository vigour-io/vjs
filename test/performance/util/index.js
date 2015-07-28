describe( 'util test', function() {

  //this is buggy shit
  // var Base = require('../../../lib/base')
  var util = require('../../../lib/util')

  it('convertToArray', function() {

    this.timeout(50000)

    var convertToArray = util.convertToArray

    console.log(util)

    function fn() {
      var arr = convertToArray(arguments)
    }

    var slice = Array.prototype.slice

    function fn2() {
      var arr = slice.apply( arguments )
    }

    var amount = 10000000
    // gaston.performance(function() {
    // }).then(function() {
    //   console.log(arguments[0]*1000)
    // })

    expect( function() {
      for(var i = 0; i < amount; i++ ) {
        fn(1,2,3,4,5,6)
      }
    }).performance(function() {
      for(var i = 0; i < amount; i++ ) {
        fn2(1,2,3,4,5,6)
      }
    })

  })

})