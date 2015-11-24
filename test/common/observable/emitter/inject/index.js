var Observable = require('../../../../../lib/observable/')

describe('Injecting listeners', function () {
  it('should fire the `new` event correctly when injected', function () {
    var newCalls = 0
    var injected = {
      on: {
        new: {
          injectedHandler () {
            newCalls++
            var obs = this
            expect(obs).to.have.property('prop1')
              .which.has.property('nest')
              .which.has.property('val', 3)
          }
        }
      }
    }

    var Custom = new Observable({
      inject: injected,
      on: {
        new: {
          newHandler () {
            newCalls++
            var obs = this
            expect(obs).to.have.property('prop1')
              .which.has.property('nest')
              .which.has.property('val', 3)  
          }
        }
      },
      prop1: {
        nest: 3
      }
    }).Constructor
    var custom = new Custom()
    expect(newCalls).to.equal(2)
  })
})
