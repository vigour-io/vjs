describe('operator', function () {
  var Event = require('../../../../lib/event')
  Event.prototype.inject(require('../../../../lib/event/toString'))

  var Base = require('../../../../lib/base')
  Base.prototype.inject(require('../../../../lib/methods/toString'))

  var Observable = require('../../../../lib/observable')
  Observable.prototype.inject(
    require('../../../../lib/operator/add')
  )

  var Operator = require('../../../../lib/operator')

  var a
  var b
  var c
  
  var measure = {
    c: {}
  }

  it('Operators fire change on parents', function () {
    measure.c = {
      val: {
        total: 0
      }
    }

    a = new Observable({
      $key: 'a',
      $val: 1
    })

    b = new Observable({
      $key: 'b',
      $val: 1
    })

    c = new Observable({
      $val: a,
      $add: b,
      $on: {
        $data: function () {
          measure.c.val.total = measure.c.val.total + 1
        }
      }
    })
    a.$val = 'x'
    b.$val = 'y'
    expect(measure.c.val.total).to.equal(2)
  })

  it('first set on operator, fires change on parent', function () {
    measure.c = {
      val: {
        total: 0
      }
    }

    a = new Observable({
      $key: 'a',
      $val: 1
    })

    b = new Observable({
      $key: 'b',
      $val: 1
    })

    c = new Observable({
      $on: {
        $data: function () {
          measure.c.val.total++
        }
      }
    })

    d = new c.$Constructor({
      $val: a,
      $add: b
    })

    expect(measure.c.val.total).to.equal(1)

    var ftotal = 0
    var F = new Observable({
      $on: {
        $data: function () {
          ftotal++
          expect(this.$val).to.equal(3)
        }
      }
    }).$Constructor

    var e = new Observable({
      bla: new F({
        $val: 1,
        $add: 2
      })
    })

    expect(ftotal).msg('ftotal').to.equal(1)

  })

  it('check if on fires when using custom flags', function () {
    var ftotal = 0
    var F = new Observable({
      $on: {
        $data: function () {
          ftotal++
          expect(this.$val).to.equal(30)
        }
      }
    }).$Constructor

    var e = new Observable({
      $flags: {
        $f: F
      }
    })

    var d = new e.$Constructor({
      $f: {
        $val: 10,
        $add: 20
      }
    })

    expect(ftotal).msg('ftotal').to.equal(1)

    var g = new d.$Constructor({
      $f: {
        $val: 20,
        $add: 10
      }
    })

    expect(ftotal).msg('ftotal').to.equal(2)

  })

  it('custom operator', function () {
    Observable.prototype.$flags = {
      $concat: new Operator({
        $key: '$concat',
        $operator: function ( val ) {
          return val + ' it works!'
        }
      })
    }

    var a = new Observable({
      $val: 'Yes',
      $concat: true
    })
    expect(a.$val).to.equal('Yes it works!')
  })

  it('parent should update the child', function () {
    var b = new Observable({
      $val: 'Yes',
      $concat: true
    })
    b.$val = 'Sure'
    expect(b.$val).to.equal('Sure it works!')
  })

  it('do not call operator function if its not been used', function () {
    var c = new Observable({
      $val: 'Yes'
    })
    expect(c.$val).to.equal('Yes')
  })
})
