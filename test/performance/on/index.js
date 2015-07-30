describe( 'on test', function() {

  //this is buggy shit
  var Obs = require('../../../lib/observable')
  var util = require('../../../lib/util')

  it( 'on multiple instances', function( done ) {
    // this.timeout(5000)
    //require gaston for node fix it!

    var a = new Obs({
      $key:'a',
      $on: {
        $change:function() {
          // console.log()
        }
      }
    })

    var amount = 1000
    var arr = []

    expect(function() {
      for( var i = 0; i < amount; i++ ) {
        arr.push( new a.$Constructor() )
      }
    }).performance( 30 )

    arr = []

    expect(function() {
      for( var i = 0; i < amount; i++ ) {
        arr.push( new a.$Constructor({
          i: i
        }) ) 
      }
    }).msg('setting i').performance( 300, done )


    // expect(function() {
     
    // }).performance( 300 )


  })

})