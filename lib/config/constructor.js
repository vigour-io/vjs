var Observable = require('../observable')
var ISNODE = require('../util/isnode')
var resolveNameSpace = require('./util/resolveNameSpace')
var findPackage = ISNODE && require('./util/findPackage')
var parseArgv = ISNODE && require('./util/parseArgv')

exports.$define = {
  $generateConstructor: function () {
    return function Config (options, event, parent, key) {
      var config = this
      var nameSpace = config._nameSpace && config._nameSpace.$val

      var val = {}

      var pkg = config._findPackage && config._findPackage.$val &&
        findPackage && findPackage()
      if (pkg) {
        pkg = resolveNameSpace(pkg, nameSpace)
        merge(val, pkg)
      }

      if (options) {
        options = resolveNameSpace(options, nameSpace)
        merge(val, options)
      }

      if (parseArgv && config._argv && config._argv.$val) {
        var setobj = parseArgv(config)
        merge(val, setobj)
      }

      Observable.call(config, val, false, parent, key)
      if (config.autoMerge) {
        config.merge(config.autoMerge)
      }
    }
  }
}

function merge (a, b) {
  for (var key in b) {
    var bProp = b[key]
    if (typeof bProp === 'object') {
      var aProp = a[key]
      if (typeof aProp !== 'object') {
        a[key] = aProp = {}
      }
      merge(aProp, bProp)
    } else {
      a[key] = bProp
    }
  }
}
