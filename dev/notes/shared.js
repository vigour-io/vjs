var shared = require('vjs/shared')

shared.$connect() // read parameters from config

shared.$connect({
  url: 'hub.vigour.io',
  region: 'DE'
})


