describe('references', function () {
  var Event = require('../../../../../lib/event')
  Event.prototype.inject(require('../../../../../lib/event/toString'))
  var Observable = require('../../../../../lib/observable')

  var measure = {
    obs: {}
  }

  var referencedObs, referencedObs2, obs

  it('create references', function () {
    measure.obs.val = 0

    referencedObs = new Observable({
      key: 'referencedObs',
      val: 'a string'
    })

    referencedObs2 = new Observable({
      key: 'referencedObs',
      val: 'a string'
    })

    obs = new Observable({
      key: 'obs2',
      on: {
        change: {
          val: function () {
            measure.obs.val++
          }
        }
      },
      val: referencedObs
    })

    expect(measure.obs.val).msg('val listener').to.equal(0)
    expect(obs).to.have.property('listensOnBase')
  })
})

//
//     var keyCount = 0
//     obs2.$listensOnBase.each(function (property, key) {
//       keyCount++
//     })
//
//     expect(keyCount).msg('amount of listeners on listensOnBase').to.equal(1)
//
//     expect(obs2.$listensOnBase).to.have.property(1)
//
//     referencedObs.$val = 'changed a string'
//
//     expect(measure.obs2.val).msg('val listener').to.equal(1)
//
//     obs2.$val = referencedObs2
//
//     expect(measure.obs2.val).msg('val listener').to.equal(2)
//
//     obs2.$val = referencedObs2
//
//     // value is the same so expect zero change
//     expect(measure.obs2.val).msg('val listener').to.equal(2)
//
//     referencedObs2.$val = 'changed a string'
//
//     expect(measure.obs2.val).msg('val listener').to.equal(3)
//
//   })
//
//   it('attach tests on obs3', function () {
//     measure.obs3.val = 0
//
//     obs3 = new Observable({
//       $key: 'obs3',
//       $on: {
//         $change: {
//           val: [
//             function ( event, meta, base, extraArg1, extraArg2 ) {
//               measure.obs3.val++
//               expect(extraArg1).to.equal('extra1')
//               expect(extraArg2).to.equal('extra2')
//             },
//             referencedObs,
//             'extra1',
//             'extra2'
//           ]
//         }
//       }
//     })
//
//     referencedObs.$val = 'lets test attach'
//     expect(measure.obs3.val).to.equal(0)
//
//     expect(referencedObs).to.have.property('$listensOnAttach')
//
//     var keyCount = 0
//     referencedObs.$listensOnAttach.each(function ( property, key ) {
//       keyCount++
//     })
//     expect(keyCount).msg('amount of listeners on listensOnAttach')
//       .to.equal(1)
//     expect(referencedObs.$listensOnAttach).to.have.property(1)
//
//     obs3.$val = referencedObs
//     expect(measure.obs3.val).to.equal(1)
//
//     referencedObs.$val = 'lets test attach, now it should fire'
//     expect(measure.obs3.val).to.equal(2)
//
//   })
