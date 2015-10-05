describe('subscribe and bind', function () {
  var Observable = require('../../../../lib/observable')

  it('create a new base inject operators', function () {
    var child = new Observable({
      inject: require('../../../../lib/operator/subscribe'),
      key: 'a',
      $subscribe: {
        upward: {
          title: true
        }
      }
    })

    // child.$subscribe.output = new Observable(1)
    // child.$subscribe.emit('data')
    child.subscribe({
      upward: {
        title: true
      }
    }, function () {
      this.$subscribe.output = 'yeeey'
    // console.log('struggles!', this)
    })

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

/*
var list = new Element({
  collection: {
    element: new Element({
      title: {
        text: {
          $subscribe: 'upward.title'
        }
      }
    })
  }
})
*/

/*
var list = new Element({
  ChildConstructor: new Element({
    title: {
      text: {
        $data:'title'
      }
    }
  }),
  $subscribe:'upward.$data.shows'
})
*/
