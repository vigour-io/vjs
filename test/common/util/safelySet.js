var Base = require('../../../lib/base')
var Observable = require('../../../lib/observable')

describe('safely set on Base', function () {
  it('should store the reserved fields elsewhere', function () {
    var test = new Base()
    test.set({
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
    }, void 0, void 0, true)
  })
})

describe('safely set on Observable', function () {
  it('should store the reserved fields elsewhere', function () {
    var test = new Observable()
    console.clear()
    test.set({
      set: 'test',
      get: 'yoyo',
      setKey: 'funtimes',
      setKeyInternal: {
        add: 12
      },
      on:{

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
      parent:true,
      path:true,
      define: false
    }, void 0, void 0, 'randomPrefix_')
    expect(test.randomPrefix_set).ok
    expect(test.randomPrefix_get).ok
    expect(test.randomPrefix_setKey).ok
    expect(test.randomPrefix_setKeyInternal).ok
    expect(test.randomPrefix_setKeyInternal.add).ok
    expect(test.randomPrefix_on).ok
    expect(test.nerdje).ok
    expect(test.nerdje.randomPrefix_set.randomPrefix_get.randomPrefix_properties.blups).ok
    expect(test.randomPrefix_parent).ok
    expect(test.randomPrefix_path).ok
  })
})
