var Observable = require('../observable')

var flatten = require('./util/flatten')
var ISNODE = require('./util/isnode')
var findPackage = ISNODE && require('./util/findPackage')
var parseArgv = ISNODE && require('./util/parseArgv')

var Constructor = new Observable().$Constructor

var Config = module.exports = function Config(package) {

  var config = this
  var nameSpace = config._nameSpace && config._nameSpace.$val

  if(!package && findPackage) {
    package = findPackage()
  }

  package = flatten(package, nameSpace)

  Constructor.call(this, package)

  if(parseArgv && config._argv && config._argv.$val){
    var setobj = parseArgv()
    config.set(setobj)
  }

  if(config.autoMerge) {
    config.merge(config.autoMerge)
  }

}
var proto = Config.prototype = Constructor.prototype

proto.inject(
  require('../methods/find'),
  require('../methods/convert'),
  require('../methods/lookUp'),
  {
    $ChildConstructor: '$Constructor',
    _nameSpace: 'vigour',
    _argv: true
  }
)

proto.define(
  require('./merge'),
  require('./resolve'),
  require('./parseValue')
)
