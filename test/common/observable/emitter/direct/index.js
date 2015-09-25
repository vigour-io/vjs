describe('direct', function () {
  require('./listeners')
  require('./references')
  require('./attach')
  require('./set')
})

// ---- !!!TO REMOVE !!!-----
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
