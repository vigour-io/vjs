'use strict'
var Observable = require('../../../../../lib/observable')
var hash = require('../../../../../lib/util/hash')

describe('multiple instances', function () {
  var measure = {
    total: 0
  }

  var a = new Observable({
    key: 'a',
    trackInstances: true,
    aField: 1,
    lurf: {
      gurk: 1
    }
  })

  a.lurf.subscribe({
    gurk: true
  }, function (data, event) {

    measure[this.path[0]] = measure[this.path[0]] ? measure[this.path[0]] + 1 : 1
    measure.total++
  })

  var b = new a.Constructor({
    key: 'b'
  })

  var c = new a.Constructor({
    key: 'c'
  })

  // it('should fire for each context', function () {
  //   a.lurf.gurk.val = 'hey!'
  //   expect(measure.a).equals(1)
  //   expect(measure.b).equals(1)
  //   expect(measure.c).equals(1)
  //   expect(measure.total).equals(3)
  // })
})

describe('spawned listeners should not fire in context', function () {
  var measure = {
    total: 0,
    type: {}
  }
  var emit = Observable.prototype.emit
  var subsObj = {
    gurk: true
  }
  var subsHash = hash(JSON.stringify(subsObj))
  var TestObservable = new Observable({
    define: {
      emit: function (type) {
        measure.type[type] = measure.type[type] ? measure.type[type] + 1 : 1
        return emit.apply(this, arguments)
      }
    },
    ChildConstructor: 'Constructor'
  }).Constructor

  var a = new TestObservable({
    key: 'a',
    trackInstances: true,
    aField: 1,
    lurf: {
      gurk: 1
    }
  })

  a.lurf.subscribe(subsObj, function () {
    measure[this.path[0]] = measure[this.path[0]] ? measure[this.path[0]] + 1 : 1
    measure.total++
  })

  var b = new a.Constructor({
    key: 'b'
  })

  var c = new a.Constructor({
    key: 'c'
  })

  var d = new a.Constructor({
    key: 'd'
  })

  var e = new a.Constructor({
    key: 'e'
  })

  measure.type = {}
  a.lurf.gurk.val = 'hey!'

  it('should emit for change once', function () {
    expect(measure.type.data).equals(1)
  })

  it('should emit for value once', function () {
    expect(measure.type.value).equals(1)
  })

  xit('should emit 5 times for subsemitter', function () {
    expect(measure.type[subsHash]).equals(5)
  })

  it('should fire subsemitter for each context', function () {
    expect(measure.a).equals(1)
    expect(measure.b).equals(1)
    expect(measure.c).equals(1)
    expect(measure.d).equals(1)
    expect(measure.e).equals(1)
  })

  it('should emit 5 times in total', function () {
    expect(measure.total).equals(5)
  })
})

describe('fire for correct instance', function () {
  var measure = {
    total: 0
  }

  var a = new Observable({
    key: 'a'
  })

  a.subscribe({
    aField: true
  }, function () {
    measure[this.path[0]] = measure[this.path[0]] ? measure[this.path[0]] + 1 : 1
    measure.total++
  })

  it('should fire only for b', function () {
    var b = new a.Constructor({
      key: 'b',
      aField: 'hello'
    })
    expect(measure.a).not.ok
    expect(measure.b).equals(1)
    expect(measure.total).equals(1)
  })
})

describe('fire for correct instance using useVal', function () {
  var measure = {
    total: 0
  }

  var a = new Observable({
    key: 'a'
  })

  a.subscribe({
    aField: true
  }, function () {
    measure[this.path[0]] = measure[this.path[0]] ? measure[this.path[0]] + 1 : 1
    measure.total++
  })

  it('should fire only for b (useVal)', function () {
    var aRandomObs = new Observable({
      b: {
        useVal: new a.Constructor({
          key: 'b', // key is not set ofc
          aField: 'hello'
        })
      }
    })
    expect(measure.a).not.ok
    expect(measure.b).equals(1)
    expect(measure.total).equals(1)
  })

  it('should fire only for b (useConstructor)')
})

require('./attach')
