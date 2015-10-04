var Base = require('../../../lib/base')
var Observable = require('../../../lib/observable')

describe('safely set on Base', function () {
  it('should store the reserved fields elsewhere', function () {
    var test = new Base({
      set: 'test',
      get: 'yoyo',
      setKey: 'funtimes',
      nerdje: {
        set: {
          get: {
            properties: {
              blups: true
            }
          }
        }
      },
      on: false
    }, void 0, void 0, void 0, true)
  })
})

describe('safely set on Observable', function () {
  it('should store the reserved fields elsewhere', function () {
    var test = new Observable()
    test.set({
      set: 'test',
      get: 'yoyo',
      setKey: 'funtimes',
      setKeyInternal: {
        add: 12
      },
      nerdje: {
        set: {
          get: {
            properties: {
              blups: true
            }
          }
        }
      },
      on: false
    }, void 0, void 0, 'randomPrefix_')
  })
})
