var Event = require('vigour-js/lib/event')
var urlConstructor = require('./childconstructor')
var Observable = require('vigour-js/lib/observable')


module.exports = new Observable({
  inject: [
    require('vigour-js/lib/operator/type'),
    require('vigour-js/lib/operator/transform')
  ],
  on: {
    new: {
      popstate () {
        this._internal = () => {
          var event = new Event(this, 'popstate')
          event.isTriggered = true
          this.href.emit('data', window.location.href, event)
          event.trigger()
          console.log('haha')
        }
        window.addEventListener('popstate', this._internal)
      }
    },
    remove: {
      popstate () {
        window.removeEventListener('popstate', this._internal)
      }
    }
  },
  $type: 'string',
  href: {
    inject: [
      require('../../../lib/operator/type'),
      require('../../../lib/operator/transform')
    ],
    $transform () {
      return global.location.href
    },
    $type: 'string',
    properties: {
      _internal: true
    },
    on: {
      data: {
        children(data, event) {
          this.parent.each(function(property, key) {
            if (key !== 'href') {
              property.emit('data', data, event)
            }
          })
        }
      }
    }
  },
  ChildConstructor: urlConstructor
})
