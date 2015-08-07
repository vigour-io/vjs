describe( 'util test', function() {

  //this is buggy shit
  var Base = require('../../../lib/base')
  var util = require('../../../lib/util')

  it('isLikeNumber vs lodash isNumber', function( done ) {
    this.timeout(50e3)
    var convertToArray = util.convertToArray
    var slice = Array.prototype.slice
    var amount = 1e6
    var isLikeNumber = util.isLikeNumber
    var isNumber = require('lodash/lang/isNumber')

    expect( function() {
      for(var i = 0; i < amount; i++ ) {
        isLikeNumber( 'a'+i )
      }
      for(var i = 0; i < amount; i++ ) {
        isLikeNumber( i )
      }
    }).performance({
      margin:3,
      method:function() {
        for(var i = 0; i < amount; i++ ) {
          isNumber( 'a'+i )
        }
        for(var i = 0; i < amount; i++ ) {
          isNumber( i )
        }
      }
    }, done )
  })

  it('convertToArray vs Array.prototype.slice', function( done ) {
    this.timeout(50e3)
    var convertToArray = util.convertToArray
    var slice = Array.prototype.slice
    var amount = 1e6

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
