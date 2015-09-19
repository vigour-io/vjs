var Observable = require('../../../../../lib/observable')

describe('multiple instances', function() {
  var measure = {
    total:0
  }

	var a = new Observable({
		$key:'a',
    $trackInstances:true,
		aField: 1,
    lurf: {
      gurk: 1
    }
	})

  a.lurf.subscribe({
    gurk:true
  }, function() {
    measure[this.$path[0]] =  measure[this.$path[0]]
      ? measure[this.$path[0]]+1
      : 1
    measure.total++
  })

  var b = new a.$Constructor({
    $key:'b'
  })

  var c = new a.$Constructor({
    $key:'c'
  })

	it( 'should fire for each context', function(){
	  a.lurf.gurk.$val = 'hey!'
    expect(measure.a).equals(1)
    expect(measure.b).equals(1)
    expect(measure.c).equals(1)
    expect(measure.total).equals(3)
	})

})

describe('multiple instances', function() {
  var measure = {
    a:0,
    b:0,
    c:0
  }

  var a = new Observable({
    $key:'a',
    $trackInstances:true
  })

  a.subscribe({
    $parent:true
  }, function() {
    measure[this.$key]++
  })

  var b = new a.$Constructor({
    $key:'b'
  })

  var c = new a.$Constructor({
    $key:'c'
  })

  it( 'should fire for own context', function(){
    console.clear()
    var parent = new Observable({
      $key:'parent',
      a:{
        $useVal: new a.$Constructor()
      }
    })

    console.log('--------->',b.$parent)

    expect(measure.a).equals(1)
    expect(measure.b).equals(0)
    expect(measure.c).equals(0)
    // expect(measure.total).equals(3)
  })

})

