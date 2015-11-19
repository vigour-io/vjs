'use strict'
var Observable = require('../observable')
const ISNODE = require('../util/is/node')
var merge = require('../util/merge')
var include = require('../util/include')
var resolveNameSpace = require('./util/resolveNameSpace')

var findPackage = require('./util/findPackage')
var parseArgv = ISNODE && require('./util/parseArgv')
var path = ISNODE && require('path')

const OBJ = 'object'

exports.define = {
  generateConstructor: function () {
    return function Config (options, event, parent, key) {
      var config = this
      var nameSpace = config._nameSpace && config._nameSpace.val

      var val = {}

      var packageDir = (options && options._packageDir)

      var pkg = config._findPackage && config._findPackage.val &&
        findPackage && findPackage(packageDir)
      if (pkg) {
        var pkgObj = resolveNameSpace(pkg, nameSpace)
        merge(val, pkgObj)
      }

      if (ISNODE) {
        var topVal = {}
        // environment variables and inline arguments go in topVal first, to be
        // used to evaluate configFiles

        merge(topVal, val)

        findEnv(topVal)

        var mergeFiles = []

        if (val.mergeFiles) {
          include(mergeFiles, val.mergeFiles)
        }
        if (topVal.mergeFiles) {
          include(mergeFiles, topVal.mergeFiles)
        }

        var setArgv = parseArgv && config._argv && config._argv.val && parseArgv(val)
        if (setArgv) {
          merge(topVal, setArgv)
          if (topVal.mergeFiles) {
            include(mergeFiles, topVal.mergeFiles)
          }
        }

        let configFiles = topVal.configFiles || val.configFiles
        mergeFromFiles(val, configFiles, nameSpace)
        mergeFromFiles(val, mergeFiles, nameSpace)

        // now actually apply env and inline on val
        findEnv(val)
        if (setArgv) {
          merge(val, setArgv)
        }

        delete val.configFiles
        delete val.mergeFiles
      }

      if (options) {
        options = resolveNameSpace(options, nameSpace)
        merge(val, options)
      }

      Observable.call(config, val, false, parent, key)
      if (config.autoMerge) {
        config.merge(config.autoMerge)
      }
    }
  }
}

function findEnv (obj) {
  var env = obj._env
  if (env && env in process.env) {
    obj.val = process.env[env]
  }
  for (let key in obj) {
    var val = obj[key]
    if (typeof val === OBJ) {
      findEnv(val)
    }
  }
}

function mergeFromFiles (obj, files, nameSpace) {
  for (let key in files) {
    let configFile = files[key]
    if (!path.isAbsolute(configFile)) {
      configFile = path.join(process.cwd(), configFile)
    }
    try {
      let configObj = require(configFile)
      configObj = resolveNameSpace(configObj, nameSpace)
      merge(obj, configObj)
    } catch (e) {
      // console.log('could not require configFile', configFile)
    }
  }
}
