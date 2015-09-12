var Observable = require('../observable')

var Config = new Observable({
  $inject: [
    require('../methods/find'),
    require('../methods/convert'),
    require('../methods/lookUp'),
    require('./merge'),
    require('./resolve'),
    require('./parseValue'),
    require('./raw'),
    require('./params')
  ],
  $ChildConstructor: '$Constructor'
}).$Constructor

module.exports = new Config({
  _nameSpace: 'vigour',
  _argv: true,
  $inject: require('./constructor')
}).$Constructor
