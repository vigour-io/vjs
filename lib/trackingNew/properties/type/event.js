// function event (event, properties, options, fn) {
var DataLayer = require('../../emitter/datalayer')

function event (data) {
  // if (is.fn(options)) fn = options, options = null
  // if (is.fn(properties)) fn = properties, options = null, properties = null
  if (data.label) data = options, options = null
  if (data.value)
  console.log('hehe')

  var event = new DataLayer ({
    context: {
      ip: '0.0.0.0',
      userAgent: navigator.userAgent
    }
  })

  // Argument reshuffling.
  /* eslint-disable no-unused-expressions, no-sequences */
  // if (is.fn(options)) fn = options, options = null
  // if (is.fn(properties)) fn = properties, options = null, properties = null
  // /* eslint-enable no-unused-expressions, no-sequences */
  //
  // // figure out if the event is archived.
  // var plan = this.options.plan || {}
  // var events = plan.track || {}
  //
  // // normalize
  // var msg = this.normalize({
  //   properties: properties,
  //   options: options,
  //   event: event
  // })
  //
  // // plan.
  // plan = events[event]
  // if (plan) {
  //   this.log('plan %o - %o', event, plan)
  //   if (plan.enabled === false) return this._callback(fn)
  //   defaults(msg.integrations, plan.integrations || {})
  // }
  //
  // this._invoke('track', new Track(msg))
  //
  // this.emit('track', event, properties, options)
  // this._callback(fn)
  // return this
}

module.exports = event
