'use strict'

var _ = require('lodash')
var isParam = /^--./

const DOT = '.'
const CAST = {
  number: Number,
  string: JSON.stringify,
  boolean: Boolean,
  object: tryParse
}

function tryParse (val) {
  try {
    return JSON.parse(val)
  }catch (err) {
    return val
  }
}

module.exports = function parseArgv (config) {
  var setobj = {}
  var args = process.argv
  for (let i = 0, param; param = args[i]; i++) {
    if (isParam.test(param)) {
      param = param.slice(2)
      let path = hasDot(param) && param.split(DOT)
      let val = args[i + 1]
      if (isParam.test(val)) {
        val = true
      } else {
        i++
        let hasValue = path
          ? _.get(config, path)
          : config[param]
        let parsed = tryParse(val)
        let type = hasValue && hasValue._type
        if (type) {
          if (typeof parsed !== type) {
            parsed = CAST[type](parsed)
            if (typeof parsed !== type) {
              throw new Error(
                'Config: wrong type! ' + val + ' should be ' + type
              )
            }
          }
        }
        val = parsed
      }
      if (path) {
        _.set(setobj, path, val)
      } else {
        setobj[param] = val
      }
    }
  }

  var configSet = setobj.config
  if (configSet) {
    var decoded
    var parsed
    try {
      decoded = decodeURIComponent(configSet)
      parsed = JSON.parse(decoded)
      configSet = parsed
      delete setobj.config
      // console.log('configset is', configSet)
      for (var s in setobj) {
        // console.log('set dat field', s, 'to\n', setobj[s])
        configSet[s] = setobj[s]
      }
      setobj = configSet
    } catch (err) {
      console.log('CONFIG ERROR! could not parse --config:\n',
        setobj.config,
        '\ngot from decodeURIComponent:', decoded,
        '\nerror: ', err
      )
    }
  }

  return setobj
}

function hasDot (str) {
  return ~str.indexOf(DOT)
}
