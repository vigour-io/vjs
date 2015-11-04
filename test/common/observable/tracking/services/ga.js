var trackerEmitter = require('../../../../../lib/tracking/emitter')
var Observable = require('../../../../../lib/observable')
var tracking = require('../../../../../lib/tracking')
var ga = require('../../../../../lib/tracking/service/ga')

trackerEmitter.inject(require('../../../../../lib/tracking/service'))

describe('Analytics', function () {
  var a = new Observable({
    b: {
      inject: tracking,
      on: {
        click: function(event, meta) {}
      },
      track: {
        click: {
          lol: 'hahah'
        }
      }
    }
  })

  var bInstance = new a.Constructor ({

  })

  it('should log plain object with datalayer content', function () {
    bInstance.b.emit('click')
  })
})
