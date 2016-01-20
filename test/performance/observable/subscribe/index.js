'use strict'

describe('Subscribe', function () {
  var arr, target //eslint-disable-line
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Observable = require('../../../../lib/observable')
  // var Event = require('../../../lib/event')
  var amount = 1e4
  var cnt = 0 //eslint-disable-line
  var loop = 1

  describe('Observable default emitters (baseline)', function () {
    function baseline () {
      arr = []
      for (var i = 0; i < amount; i++) {
        var a = new Observable({ //eslint-disable-line
          on: {
            data () {
              // cnt++
            }
          }
        })
        // a.val = i
        arr.push(a)
      }
    }

    function baseline2 () {
      arr = []
      for (var i = 0; i < amount; i++) {
        var a = new Observable()
        a.on('data', function () {})
        // a.val = i
        arr.push(a)
      }
    }

    it('creating observables with listeners using set object (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(baseline).performance({
        loop: loop,
        time: 4000
      }, done)
    })

    it('creating observables with listeners using on (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(baseline2).performance({
        loop: loop,
        time: 4000
      }, done)
    })

    it('firing listeners on observables (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        var len = arr.length
        for (let i = 0; i < len; i++) {
          arr[i].val = i * 2
        }
      }).performance({
        loop: loop,
        time: 4000,
        before: baseline
      }, function () {
        // console.log('CNT!', cnt)
        done()
      })
    })

    function observablesContext () {
      arr = []
      cnt = 0
      var Obs = new Observable({ //eslint-disable-line
        key: 'a',
        b: {
          trackInstances: true,
          c: {
            on: {
              data () {
                // console.log('mofo!', this.path)
              }
            }
          }
        },
        trackInstances: true
      }).Constructor
      for (let i = 0; i < amount; i++) {
        arr.push(new Obs({ val: i, key: i }))
      }
    }

    it('creating observables (3 levels) with context listeners (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(observablesContext).performance({
        loop: loop,
        time: 4000
      }, done)
    })

    it('firing observables over context (3 levels) listeners (' + amount + ')', function (done) {
      this.timeout(50e3)
      expect(function () {
        // console.log('----here--- start')
        var c = arr[0].b.c
        c.clearContextUp()
        c.emit('data')
      }).performance({
        loop: loop,
        before: observablesContext,
        time: 4000
      }, done)
    })

    // it('creating observables add listeners on contextlevel , fire on creation (' + amount + ')', function (done) {
    //   this.timeout(50e3)
    //   var thing = new Observable({
    //     b: true,
    //     on: { data () {} }
    //   })
    //   var Thing = thing.Constructor
    //   expect(function () {
    //     arr = []
    //     for (var i = 0; i < amount; i++) {
    //       var a = new Thing({
    //         val: i
    //       })
    //       arr.push(a)
    //     }
    //   }).performance({
    //     loop: 10,
    //     time: 100
    //   }, done)
    // })
    //
    // it('firing listeners on observables fire over context (' + amount + ')', function (done) {
    //   this.timeout(50e3)
    //   var thing
    //   expect(function () {
    //     thing.val = 'a'
    //   }).performance({
    //     loop: 10,
    //     time: 100,
    //     before: function () {
    //       arr = []
    //       if (thing) {
    //         thing.remove()
    //       }
    //       thing = new Observable({
    //         b: true,
    //         on: { data () {} }
    //       })
    //       var Thing = thing.Constructor
    //       for (var i = 0; i < amount; i++) {
    //         var a = new Thing()
    //         arr.push(a)
    //       }
    //     }
    //   }, done)
    // })

    function onlistener () {
      for (var i = 0; i < amount; i++) {
        // make specifics for internal every field
        // oemitData , onData etc -- this will imporve perf a lot im sure (way less checks)
        arr[i].on('data', function () {})
      }
    }

    // it('add on listeners (basic data /w function) on existing emitters (' + amount + ')', function (done) {
    //   this.timeout(50e3)
    //   expect(onlistener).performance({
    //     loop: 1,
    //     time: 500,
    //     before: baseline
    //   }, done)
    // })

    // it('add on listeners (basic data /w function) create new emitters (' + amount + ')', function (done) {
    //   this.timeout(50e3)
    //   expect(onlistener).performance({
    //     loop: 10,
    //     time: 500,
    //     before: function () {
    //       arr = []
    //       for (var i = 0; i < amount; i++) {
    //         arr.push(new Observable())
    //       }
    //     }
    //   }, done)
    // })
    //
    // function createReferences () {
    //   arr = []
    //   // if (target) {
    //     // target.remove()
    //   // }
    //   target = new Observable('a')
    //   for (var i = 0; i < amount; i++) {
    //     var a = new Observable({
    //       val: target,
    //       on: {
    //         data () {}
    //       }
    //     })
    //     arr.push(a)
    //   }
    // }
    //
    // it('create references (' + amount + ')', function (done) {
    //   this.timeout(50e3)
    //   expect(createReferences).performance({
    //     loop: 10,
    //     time: 500
    //   }, done)
    // })
    //
    // it('remove reference (' + amount + ')', function (done) {
    //   this.timeout(50e3)
    //   expect(function () {
    //     target.remove()
    //   }).performance({
    //     loop: 10,
    //     time: 500
    //   }, done)
    // })
    //
    // it('firing listeners on observables over references (' + amount + ')', function (done) {
    //   this.timeout(50e3)
    //   expect(function () {
    //     target.val = 'b'
    //   }).performance({
    //     loop: 10,
    //     time: 100,
    //     before: createReferences
    //   }, done)
    // })
  })

  // describe('Existing field', function () {
  //   function observable () {
  //     arr = []
  //     for (var i = 0; i < amount; i++) {
  //       var a = new Observable({ //eslint-disable-line
  //         b: true
  //       })
  //       a.subscribe({
  //         b: true
  //       }, function () {})
  //       arr.push(a)
  //     }
  //   }
  //
  //   it('creating observables and subscribing on existing field (' + amount + ')', function (done) {
  //     this.timeout(50e3)
  //     expect(observable).performance({
  //       loop: 10,
  //       time: 100
  //     }, done)
  //   })
  //
  //   it('firing listeners on observables when subscribing on existing field (' + amount + ')', function (done) {
  //     this.timeout(50e3)
  //     expect(function () {
  //       var len = arr.length
  //       for (let i = 0; i < len; i++) {
  //         arr[i].b.val = i * 2
  //       }
  //     }).performance({
  //       loop: 10,
  //       time: 100,
  //       before: observable
  //     }, done)
  //   })
  //
  //   it('creating observables subscribing using context (' + amount + ')', function (done) {
  //     this.timeout(50e3)
  //     var thing = new Observable({
  //       b: true
  //     })
  //     thing.subscribe({
  //       b: true
  //     })
  //     var Thing = thing.Constructor
  //     expect(function () {
  //       arr = []
  //       for (var i = 0; i < amount; i++) {
  //         var a = new Thing({
  //           b: i
  //         })
  //         arr.push(a)
  //       }
  //     }).performance({
  //       loop: 10,
  //       time: 100
  //     }, done)
  //   })
  // })
})
