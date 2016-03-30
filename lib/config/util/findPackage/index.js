const ISNODE = require('../../../util/is/node')

module.exports = ISNODE
  ? require('./node')
  : require('./browser')
