describe('subscribe and bind', function () {
  var Observable = require('../../../../lib/observable')

  it('create a new base inject operators', function () {
    var child = new Observable({
      inject: require('../../../../lib/operator/subscribe'),
      key: 'a',
      // val: 'hello',
      $subscribe: {
        upward: {
          title: true
        }
      }
    })

    // child.$subscribe.output = new Observable(1)
    // child.$subscribe.emit('data')

    var parent = new Observable({
      title: 'myTitle',
      a: {
        useVal: child
      }
    })

    expect(child.val).equals('myTitle')
  })
})

// describe('subscribe and bind', function () {
//   var Observable = require('../../../../lib/observable')
//   it('create a new base inject operators', function () {
//     var child = new Observable({
//       inject: require('../../../../lib/operator/subscribe'),
//       key: 'a',
//       // val: 'hello',
//       $subscribe: {
//         parent: {
//           title: true
//         }
//       }
//     })

//     var parent = new Observable({
//       title: 'myTitle',
//       a: {
//         useVal: child
//       }
//     })

//     expect(child.val).equals('myTitle')
//   })
// })

// var obs = new Observable({
//   $data: {
//     title: true,
//     description: true
//   }
// })

// var obs = new Observable({
//   title: {
//     $data: 'title'
//   },
//   subtitle: {
//     $data: 'subtitle'
//   }
// })

// var obs = new Observable({
//   $data: 'info',
//   $filter: {
//     title: true,
//     subtitle: true
//   }
// })
