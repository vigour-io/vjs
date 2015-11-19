'use strict'

var logging = require('./log')
// var googleAnalytics = require('./ga')
var analytics = require('./segment')


exports.services = {
  log: function(obj) {
    logging(obj)
  },
  // ga: function(obj) {
  //   googleAnalytics(obj)
  // },
  segment: function(obj) {
    analytics.page({
      userId: '019mr8mf4r',
      category: 'Docs',
      name: 'Node.js Library',
      properties: {
        url: 'https://segment.com/docs/libraries/node',
        path: '/docs/libraries/node/',
        title: 'Node.js Library - Segment',
        referrer: 'https://github.com/segmentio/analytics-node'
      }
    })
  }
}
