var Observable = require('../observable')
var ISNODE = require('../util/isnode')
var resolveNameSpace = require('./util/resolveNameSpace')
var findPackage = ISNODE && require('./util/findPackage')
var parseArgv = ISNODE && require('./util/parseArgv')

var Constructor = new Observable().$Constructor

exports.$define = {
  $generateConstructor: function () {
    return Config
  }
}

function Config (options) {
  var config = this
  var nameSpace = config._nameSpace && config._nameSpace.$val

  var pckg = config._findPackage && config._findPackage.$val &&
    findPackage && findPackage()

  // TODO: clean this up, make one val and call constructor with it
  Constructor.call(this, {})

  if (pckg) {
    pckg = resolveNameSpace(pckg, nameSpace)
    config.set(pckg)
  }
  if (options) {
    options = resolveNameSpace(options, nameSpace)
    config.set(options)
  }

  if (parseArgv && config._argv && config._argv.$val) {
    var setobj = parseArgv(config)
    config.set(setobj)
  }

  if (config.autoMerge) {
    config.merge(config.autoMerge)
  }
}
