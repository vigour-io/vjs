'use strict'

describe('Subscribe operator', function () {
  var perf = require('chai-performance')
  perf.log = true
  chai.use(perf)
  var Observable = require('../../../lib/observable')
  Observable.prototype.inject(require('../../../lib/operator/subscribe'))
  var amount = 1e3

  function subscribe () {
    var collection = new Observable({
      // $: 
    })
    for (var i = 0; i < amount; i++) {

    }
  }

  // it('subscribe (' + amount + ')', function (done) {
  //   this.timeout(50e3)
  //   expect(subscribe).performance({
  //     loop: 100,
  //     margin: 8,
  //     method: function () {
  //       var arr = []
  //       for (var i = 0; i < amount; i++) {
  //         var a = { //eslint-disable-line
  //           val: function () {}
  //         }
  //         arr.push(a)
  //       }
  //     }
  //   }, done)
  // })
})

// describe('Subscribe operator', function () {
//   var perf = require('chai-performance')
//   perf.log = true
//   chai.use(perf)
//   var Observable = require('../../../lib/observable')
//   Observable.prototype.inject(require('../../../lib/operator/subscribe'))
//   var amount = 1e3

//   function subscribe () {
//     var arr = []
//     for (var i = 0; i < amount; i++) {
//       var a = new Observable({ //eslint-disable-line
//         val: function () {}
//       })
//       arr.push(a)
//     }
//   }

//   it('subscribe (' + amount + ')', function (done) {
//     this.timeout(50e3)
//     expect(subscribe).performance({
//       loop: 100,
//       margin: 8,
//       method: function () {
//         var arr = []
//         for (var i = 0; i < amount; i++) {
//           var a = { //eslint-disable-line
//             val: function () {}
//           }
//           arr.push(a)
//         }
//       }
//     }, done)
//   })
// })
