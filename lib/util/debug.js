'use strict'
global.debug = exports
exports.stack = function () {
  var err = new Error()
  var arr = err.stack.match(/at ([a-zA-Z0-9\.\[\]_<>]*?) /g)
  var r = []
  for (var i = 2; i < arr.length; i++) {
    r.push(arr[i].slice(3))
  }
  r.toString = function () {
    // console.log(err.stack)
    return '\n   ' + r.join('\n   ')
  }
  r.log = function (val) {
    console.log(val, r.toString())
  }
  return r
}

var Base = require('../base')
// console.log(this._path)
exports.context = function (obs, obj) {
  obj = obj || {}
  if (obs && obs._context) {
    obj[obs.uid] = {
      path: obs._path,
      uid: obs.uid,
      context: {
        path: obs._context._path,
        uid: obs._context.uid
      }
    }
  }
  for (var i in obs) {
    if (i !== '_parent' && i !== '_context' && i !== '_Constructor' && i[0] !== '_' && i !== 'val'
      && i !== 'listensOnBase' && i !== 'base' && i !== '_on'
      ) {
      if (obs['_' + i] && obs['_' + i] && obs['_' + i] instanceof Base) {
        exports.context(obs['_' + i], obj)
      } else if (obs.hasOwnProperty(i) && obs[i] && obs[i] instanceof Base) {
        exports.context(obs[i], obj)
      } else {

      }
    }
  }
  obj.toString = function () {
    var str = '\n'
    for (var i in obj) {
      if (obj[i] && obj[i].path) {
        str += '\n  PATH: ' + obj[i].path.join('.') + ' CPATH: ' + obj[i].context.path
      }
    }
    return str
  }
  obj.log = function (val) {
    console.log(val, obs._path, obj.toString())
  }
  return obj
}

