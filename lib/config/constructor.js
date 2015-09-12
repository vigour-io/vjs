// var log = gaston.log.make('config')

var Observable = require('../observable')
var flatten = require('../util/flatten')
var ISNODE = require('../util/isnode')
var resolveNameSpace = require('./util/resolveNameSpace')
var findPackage = ISNODE && require('./util/findPackage')
var parseArgv = ISNODE && require('./util/parseArgv')

var Constructor = new Observable().$Constructor

exports.$define = {
  $generateConstructor: function() {
    return Config
  }
}

function Config(package) {
  var config = this
  var nameSpace = config._nameSpace && config._nameSpace.$val

  if(!package && findPackage) {
    package = findPackage()
  }

  package = resolveNameSpace(package, nameSpace)

  Constructor.call(this, package)

  if(parseArgv && config._argv && config._argv.$val){
    var setobj = parseArgv()
    config.set(setobj)
  }

  if(config.autoMerge) {
    config.merge(config.autoMerge)
  }
}
