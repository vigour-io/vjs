'use strict'
var Base = require('../../base/')
Base.prototype.inject(
  require('../../methods/plain')
)

// Event.prototype.inject(require('../../../../lib/event/toString'))

module.exports = new Base({
  app: 'my app id',
  id: '',
  eventObject: {
    eventOriginator: '',
    eventType: '',
    stamp: ''
  }
}).Constructor

// module.exports = new Base({
//   anonymousId: '',
//   context: {
//     app: {
//       name: // config.app.name
//       version: // version
//       build: // config
//     },
//     campaign: {
//       name:
//       source:
//       medium:
//       term:
//       content:
//     },
//     device: {
//       id:
//       advertisingId:
//       adTrackingEnabled: true,
//       manufacturer:
//       model:
//       name:
//       type: 'ios'
//       token:
//     },
//     ip: 0.0.0.0
//     locale: "nl-NL"
//     network: {
//       bluetooth: false,
//       carrier: 'value'
//       cellular:
//       wifi:
//     },
//     location: {
//       city:
//       country: 'value'
//       lattitude:
//       longitude:
//       speed:
//     },
//     os: {
//       name:
//       version:
//     },
//     referrer: {
//       id:
//       type:
//     },
//     screen: {
//       width: 320,
//       height: 568,
//       density: 2
//     },
//     timezone:
//     userAgent:
//   }
//
// }).Constructor
