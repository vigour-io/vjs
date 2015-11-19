var Observable = require('../../../../lib/observable/')
var tracking = require('../../../../lib/trackingNew/')
var trackerEmitter = require('../../../../lib/trackingNew/emitter')

var exampleReference = new Observable({
  exampleKey: {
    key: 'aReference'
  }
})

console.log(b)
var exampleObservable = new Observable({
  key: 'a',
  b: {
    val: exampleReference.exampleKey,
    inject: tracking,
    on: {
      data: function (data, event) {},
      navigation: function (data, event) {},
      click: function (data, event) {}
    },
    // track: navigation.pageview('home')
    track: {
      navigation: {
        type: 'pageview',
        name: 'home'
        // contextual: true || id or rick
      }
      // navigation: {
      //   pageview: {
      //     name: 'home'
      //   }
      // }
    }
  }
})

it('should track an error event correctly', function (done) {
  trackerEmitter.services.test = function (obj) {
    expect(obj.eventObject.eventType.val).to.equal('click')
  }
  exampleObservable.b.emit('navigation')
  done()
})
