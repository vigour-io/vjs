var router = require('./index.js')

router.set({
  on: {
    new: {
      popstate () {
        this._internal = () => {
          var event = new Event(this, 'popstate')
          event.isTriggered = true
          this.href.emit('data', window.location.href, event)
          event.trigger()
          console.log('haha');
        }
        window.addEventListener('popstate', this._internal)
      }
    },
    remove: {
      popstate () {
        window.removeEventListener('popstate', this._internal)
      }
    }
  }
})
