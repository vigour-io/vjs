'use strict'
describe('context', function () {
  var Observable = require('../../../../../lib/observable')

  function contextObservable () {
    var cnt = {
      total: 0
    }
    var a = new Observable({
      key: 'a',
      trackInstances: true,
      b: {
        on: {
          data () {
            var key = this.path[0]
            cnt[key] = cnt[key] ? cnt[key] + 1 : 1
            cnt.total++
          }
        }
      }
    })
    var aInstance = new a.Constructor({
      key: 'aInstance'
    })
    return {
      cnt: cnt,
      a: a,
      aInstance: aInstance
    }
  }

  describe('deep resolve test', function () {
    var test = contextObservable()
    it('should fire once for "blurf"', function () {
      test.blurf = new test.a.Constructor({
        key: 'blurf',
        b: {
          hello: {
            a: true,
            b: true
          }
        }
      })
      expect(test.cnt.total).to.equal(1)
      expect(test.cnt.blurf).to.equal(1)
    })

    xit('should fire zero times for "blurf1", should not resolve context', function () {
      // there is no change so should not resolve context -- need to fix this later
      test.blurf1 = new test.blurf.Constructor({
        key: 'blurf1',
        b: {
          hello: {
            a: true,
            b: true
          }
        }
      })
      expect(test.blurf1.b).to.equal(test.blurf.b)
      expect(test.cnt.total).to.equal(1)
    })

    it('should fire once for "blurf2"', function () {
      test.blurf2 = new test.blurf.Constructor({
        key: 'blurf2',
        b: {
          mur: true,
          hello: {
            a: true,
            b: true
          }
        }
      })
      // expect(test.blurf2.b.hello).to.equal(test.blurf.b.hello)
      expect(test.cnt.blurf2).to.equal(1)
    })
  })

  describe('resolve context by adding new listener on context of reference', function () {
    var a = new Observable({
      key: 'a',
      trackInstances: true,
      // if this is not there it should however track for a new instance of b
      nest: {
        // trackInstances:true,
        // if not trackinstances on a does not track for contexts (makes sense)
        on: {
          // if the emitter is not there it will not fire for instances!
          data () {}
        }
      }
    })
    var b = new a.Constructor({
      key: 'b'
    })

    var d = new Observable({
      key: 'd',
      field: {}
    })

    var fired

    it('should resolve context for b.nest (e has a reference)', function () {
      var e = new d.Constructor({
        key: 'e',
        field: {
          val: b.nest,
          on: {
            data: function () {
              fired = this.path
            }
          }
        }
      })
      expect(e).instanceof(d.Constructor)
      expect(b.nest._on.data.base[e.field.uid]._path).to.deep.equal(['e', 'field'])
      expect(a.nest._on.data.base).not.ok
      expect(b.nest).to.not.equal(a.nest)
      expect(b.nest._on).to.not.equal(a.nest.on)
      expect(b.nest._on.data).msg('change emitter').to.not.equal(a.nest._on.data)
      expect(b.nest._on._path).to.deep.equal(['b', 'nest', '_on'])
    })

    it('should fire for e', function () {
      a.nest.val = 'rick'
      expect(fired).to.deep.equal(['e', 'field'])
    })
  })

  describe('emit on instance', function () {
    var test = contextObservable()
    it('emit data on b', function () {
      test.aInstance.b.emit('data') // = 'b change'
    })
    it('should not fire for "a"', function () {
      expect(test.cnt.a).not.ok // and this is correct only want to emit for context
    })
    it('should fire once for "aInstance" context', function () {
      expect(test.cnt.aInstance).to.equal(1)
    })
    it('should fire once in total', function () {
      expect(test.cnt.total).to.equal(1)
    })
  })

  describe('resolve context over multiple contexts', function () {
    var fired
    var x = new Observable()
    var y = new Observable({
      key: 'y'
    })
    var c = new Observable({
      useVal: true,
      val: x
    })
    var a = new Observable({
      useVal: true,
      nest: c
    })
    var d = new Observable({
      key: 'd',
      x: {
        b: new a.Constructor()
      }
    })
    var b = new d.Constructor({
      key: 'b'
    })

    it('should have resolved context', function () {
      b.x.b.nest.set({
        val: y,
        on: {
          data: function () {
            fired = this.path
          }
        }
      })
      expect(b.x.b.nest).msg('b.x.b.nest').to.not.equal(c)
      expect(d.x.b.nest).msg('d.x.b.nest').to.not.equal(b.x.b.nest)
      expect(d.x.b).msg('d.x.b').to.not.equal(b.x.b)
      expect(d.x).msg('d.x').to.not.equal(b.x)
    })

    it('should not crash and fire once for the instance', function () {
      y.val = 'xxxx'
      expect(fired).to.deep.equal(['b', 'x', 'b', 'nest'])
    })
  })

  describe('set on instance', function () {
    var test = contextObservable()
    test.aInstance.b.val = 'b change'
    it('should fire once for "aInstance" context', function () {
      expect(test.cnt.aInstance).to.equal(1)
    })
    it('should fire once in total', function () {
      expect(test.cnt.total).to.equal(1)
    })
  })

  describe('multiple instances', function () {
    var test = contextObservable()
    var c

    it('create new instance', function () {
      c = new test.a.Constructor({
        key: 'c'
      })
    })

    it('should be and instance of a', function () {
      expect(c).instanceof(test.a.Constructor)
    })

    it('set a.b value', function () {
      test.a.b.val = 'a change'
    })

    it('should fire once for "a" context', function () {
      expect(test.cnt.a).to.equal(1)
    })
    it('should fire once for "aInstance" context', function () {
      expect(test.cnt.aInstance).to.equal(1)
    })
    it('should fire once for "c" context', function () {
      expect(test.cnt.c).to.equal(1)
    })
    it('should fire 3 times in total', function () {
      expect(test.cnt.total).to.equal(3)
    })
  })

  describe('multiple contexts and instances', function () {
    var test = contextObservable()

    test.c = new test.a.Constructor({
      key: 'c'
    })
    test.d = new test.a.Constructor({
      key: 'd'
    })

    it('creates "e" sets b and should fire once for "e" instance', function () {
      test.e = new test.a.Constructor({
        key: 'e',
        b: 'b'
      })
      expect(test.cnt.e).to.equal(1)
    })

    it('sets a.b and should fire once for "a"', function () {
      test.a.set({
        b: 'a'
      })
      // test.a.b.val = 'a'
      expect(test.cnt.a).to.equal(1)
    })

    it('should fire once for "c"', function () {
      expect(test.cnt.c).to.equal(1)
    })

    it('should fire once for "d"', function () {
      expect(test.cnt.d).to.equal(1)
    })

    it('should fire once for "aInstance"', function () {
      expect(test.cnt.aInstance).to.equal(1)
    })

    it('should not fire for "e"', function () {
      // TOOD: disconnected catch irrelevant change
      // now update for update on val a (altough its not shared) FIX!
      expect(test.cnt.e).to.equal(1)
    })
  })

  describe('instance with a different parent', function () {
    var test = contextObservable()

    it('creates a new a.b (c) should fire once for c', function () {
      test.c = new test.a.b.Constructor({
        key: 'c'
      })
      expect(test.cnt.c).to.equal(1)
    })

    it('sets a.b, should fire once for "a"', function () {
      test.a.b.val = 'a change'
      expect(test.cnt.a).to.equal(1)
    })

    it('should fire once for "aInstance"', function () {
      expect(test.cnt.aInstance).to.equal(1)
    })

    it('should fire once for "c"', function () {
      expect(test.cnt.c).to.equal(2)
    })

    it('should fire 4 times in total', function () {
      expect(test.cnt.total).to.equal(4)
    })
  })

  describe('different instances, different contexts', function () {
    var test = contextObservable()

    it('creates a new "a.b" --> "c" should fire once for "c"', function () {
      test.c = new test.a.b.Constructor({
        key: 'c'
      })
      expect(test.cnt.a).msg('no update on a').to.be.not.ok
      expect(test.cnt.c).msg('c').to.equal(1)
      expect(test.cnt.total).msg('total').to.equal(1)
    })

    it('creates a new "a" --> "d" (nest observable) should not fire', function () {
      test.d = new Observable({
        key: 'd',
        nest: { useVal: new test.a.Constructor() }
      })

      expect(test.cnt.a).msg('no update on a').to.be.not.ok
      expect(test.cnt.c).msg('c').to.equal(1)
      expect(test.cnt.total).msg('total').to.equal(1)
    })

    it('sets a, should fire for c, a, aIsntance, d', function () {
      test.a.b.val = 'marcus'
      expect(test.cnt.a).msg('a').to.equal(1)
      expect(test.cnt.aInstance).msg('aInstance').to.equal(1)
      expect(test.cnt.d).msg('d').to.equal(1)
      expect(test.cnt.c).msg('c').to.equal(2)
      expect(test.cnt.total).msg('total').to.equal(5)
    })
  })

  describe('contexts to instances updates', function () {
    var test = contextObservable()
    it('creates a new "a" --> "c" (nest observable) should not fire', function () {
      test.c = new Observable({
        key: 'c',
        trackInstances: true
      })
      var Constructor = test.c.Constructor
      test.c.set({
        nest: { useVal: new test.a.Constructor() }
      })
      expect(Constructor.prototype).equals(test.c)
      expect(test.cnt.a).msg('no update on a').to.be.not.ok
      expect(test.cnt.total).msg('total').to.equal(0)
    })

    it('creates new instances of "c" --> "d" and "e", should not fire', function () {
      test.d = new test.c.Constructor({
        key: 'd'
      })
      test.e = new test.c.Constructor({
        key: 'e'
      })
      expect(test.cnt.a).msg('no update on a').to.be.not.ok
      expect(test.cnt.total).msg('total').to.equal(0)
    })

    it('fires from context in c', function () {
      expect(test.cnt.total).msg('total').to.equal(0)

      test.c.nest.b.emit('data')

      // orginator does not fire for some weird reason...
      // so apparently it was fired from the emitInternal /but w a context
      expect(test.cnt.d).msg('d').to.equal(1)
      expect(test.cnt.e).msg('e').to.equal(1)
      expect(test.cnt.c).msg('c').to.equal(1)
      expect(test.cnt.total).msg('total').to.equal(3)
      expect(test.cnt.a).msg('no update on a').to.be.not.ok
    })

    it('fires from context in c (second time)', function () {
      test.c.nest.b.emit('data')
      expect(test.cnt.d).msg('d').to.equal(2)
      expect(test.cnt.e).msg('e').to.equal(2)
      expect(test.cnt.c).msg('c').to.equal(2)
      expect(test.cnt.total).msg('total').to.equal(6)
      expect(test.cnt.a).msg('no update on a').to.be.not.ok
    })

    it('fires from resolved a.b in c', function () {
      test.c.nest.set({
        b: 'something'
      })
      expect(test.cnt.c).msg('c').to.equal(3)
      expect(test.cnt.d).msg('d').to.equal(3)
      expect(test.cnt.e).msg('e').to.equal(3)
      expect(test.cnt.total).msg('total').to.equal(9)
      expect(test.cnt.a).msg('no update on a').to.be.not.ok
    })
  })

  describe('Update on instance that has an instance, in a nested field', function () {
    var a, a1, a2
    var measure = {}
    it('should call change function the correct amount of times', function () {
      a = new Observable({
        key: 'a',
        trackInstances: true,
        c: {
          on: {
            data: function (event) {
              var cnt = measure[this.path[0]]
              measure[this.path[0]] = cnt ? cnt + 1 : 1
            }
          }
        }
      })

      a1 = new a.Constructor({
        key: 'a1'
      })

      a2 = new a1.Constructor({
        key: 'a2'
      })

      a1.c.val = 'xxx'
      expect(a2).instanceof(a.Constructor)
      expect(measure.a2).msg('a2').to.equal(1)
      expect(measure.a1).msg('a1').to.equal(1)
      expect(measure.a).msg('a').to.be.not.ok
    })
  })

  describe('Update on instance that has an instance, in a nested field deep', function () {
    var a, a1, a2
    var measure = {}

    it('should call change function the correct amount of times', function () {
      a = new Observable({
        key: 'a',
        trackInstances: true,
        c: {
          d: {
            e: {
              on: {
                data: function (event) {
                  var cnt = measure[this.path[0]]
                  measure[this.path[0]] = cnt ? cnt + 1 : 1
                }
              }
            }
          }
        }
      })

      a1 = new a.Constructor({
        key: 'a1'
      })

      a2 = new a1.Constructor({
        key: 'a2'
      })

      expect(a2).instanceof(a.Constructor)
      expect(measure.a2).msg('a2').to.be.not.ok
      a1.c.d.e.val = 'xxx'
      expect(measure.a1).msg('a1').to.equal(1)
      expect(measure.a).msg('a').to.be.not.ok
      expect(measure.a2).msg('a2').to.equal(1)
    })
  })

  describe('Multiple context levels', function () {
    it('should fire once for each context level', function () {
      var measure = {}
      var a = new Observable({
        useVal: true,
        trackInstances: true,
        key: 'a',
        b: {
          on: {
            data: function (event) {
              // path is suddenly wrong here!
              measure[this.path[0]] = measure[this.path[0]]
                ? measure[this.path[0]] + 1
                : 1
            }
          }
        }
      })

      var firstUseVal = new Observable({
        key: 'firstUseVal',
        trackInstances: true,
        useVal: true,
        nest1: new a.Constructor()
      })

      // this one gets overwritten somewhere
      var secondUseVal = new Observable({ //eslint-disable-line
        key: 'secondUseVal',
        nest2: new firstUseVal.Constructor()
        // difference is it now has its own thing
      })
      a.b.val = 'rick'
      // expect(secondUseVal.nest2).instanceof(firstUseVal.Constructor)
      expect(measure).to.have.property('a').which.equals(1)
      expect(measure).to.have.property('secondUseVal').which.equals(1)
      expect(measure).to.have.property('firstUseVal').which.equals(1)
    })
  })

  require('./nested')
  require('./attach')
  require('./references')
  // now the test for custom emits (hard case -- sets are relativly easy)
  // for this you need to do emits to contexts to contexts -- really strange
  // within my context search for instance but not if im emitted from context
  // maybe add a thing for that?
})
