describe('direct', function () {
  require('./listeners')
  require('./references')
  require('./attach')
})

//
//   it('use $block on a new observable --> obs4', function () {
//     var cnt = 0
//     var cnt2 = 0
//
//     var obs4 = new Observable({
//       $key: 'obs4',
//       specialField: {
//         $on: {
//           $change: function () {
//             expect(this.$val).msg('specialField').to.equal('hello')
//             cnt2++
//           }
//         }
//       },
//       $on: {
//         $change: function (event) {
//           cnt++
//           event.$block = true
//
//           this.set({
//             specialField: 'xxxx',
//             letsSee: true
//           }, event)
//
//           this.set({
//             specialField: 'hello'
//           }, event)
//
//           event.$block = null
//         }
//       }
//     })
//
//     expect(cnt).msg('obs4 listener fired').to.equal(0)
//     expect(cnt2).msg('specialField fired').to.equal(0)
//
//     obs4.set({ hello: true })
//
//     expect(cnt).msg('obs4 listener fired').to.equal(1)
//     expect(cnt2).msg('specialField fired').to.equal(1)
//
//   })
//
//   it('change nested fields , fire correct emitters', function () {
//     var measure = {
//       a: 0,
//       x: 0
//     }
//     var a = new Observable({
//       $key: 'a',
//       $on: {
//         $change: function () {
//           measure.a++
//         }
//       },
//       x: {
//         $on: {
//           $change: function ( event, meta ) {
//             measure.x++
//           }
//         }
//       }
//     })
//     a.set({
//       x: true
//     })
//     expect(measure.a).to.equal(0)
//     expect(measure.x).to.equal(1)
//   })
//
//   it('should emit change event when property is removed due to ' +
//   'parent / ancestor properties being removed',
//     function () {
//       var a = new Observable({
//         $key: 'a',
//         b: {
//           c: true
//         }
//       })
//       var count = 0
//       a.b.c.on('$change', function () {
//         count++
//       })
//       a.b.remove()
//       expect(count).to.equal(1)
//     }
//   )
//
//   it('should emit fire once for specific value (.fire)',
//     function () {
//       var a = new Observable({
//         $key: 'a',
//         b: {
//           c: true
//         }
//       })
//       function listener () {
//         count++
//       }
//       var count = 0
//       a.b.c.on('$change', listener)
//       a.b.c.$on.$change.fire(listener)
//       expect(count).to.equal(1)
//     }
//   )
//
// })
