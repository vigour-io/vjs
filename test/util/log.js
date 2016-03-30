var log = require('npmlog')
  , prefixStyle = { fg:'cyan' }
  , header = '________________________________________________'

log.enableColor()

log.addLevel('fail',5, { fg: 'white', bg: 'red' })
log.addLevel('pass',5, { fg: 'white', bg: 'green' })
log.addLevel(header,5, { fg: 'white' })
log.addLevel('test',5, { fg: 'magenta', bg: 'white' })

log.level=10

module.exports = exports = log

exports.header = function(str, info) {
  log.prefixStyle = { fg:'white'}
  log.log(header, str , (info || ''))
  log.prefixStyle = prefixStyle
}


