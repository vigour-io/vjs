'use strict'
var Observable = require('../observable')
var ISNODE = require('../util/is/node')
var merge = require('../util/merge')
var resolveNameSpace = require('./util/resolveNameSpace')
var findPackage = ISNODE && require('./util/findPackage')
var parseArgv = ISNODE && require('./util/parseArgv')

exports.define = {
  generateConstructor: function () {
    return function Config (options, event, parent, key) {
      var config = this
      var nameSpace = config._nameSpace && config._nameSpace.val

      var val = {}

      var packageDir = (options && options._packageDir)
        ? options._packageDir
        : process.cwd()

      var pckg = config._findPackage && config._findPackage.val &&
        findPackage && findPackage(packageDir)
      if (pckg) {
        pckg = resolveNameSpace(pckg, nameSpace)
        merge(val, pckg)
      }

      if (options) {
        options = resolveNameSpace(options, nameSpace)
        merge(val, options)
      }

      if (parseArgv && config._argv && config._argv.val) {
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
