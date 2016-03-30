var util = require('../')
  , ajax
  , PACKAGE = '/package.json'

module.exports = exports = function(callback, params) {
  var obj = {}
    , req = module.exports
    , cb = callback && function(pckg) {
      obj = pckg.vigour
      req.parse(obj,window.package,req._checks)
      module.exports = obj
      callback(obj)
    }

  //default option add more!
  if(!params) {
    exports.options.val(obj, cb)
  } else if(exports.options[params]) {
    exports.options[params](obj, cb)
  } else {
    exports.options.val(obj, cb, params)
  }
  return obj
}

if(util.isNode) {
  exports.options = {
    val:function(obj) {


    }
  }
} else {
  ajax = require('../../browser/network/ajax')
  exports.options = {
    val:function(obj, callback, params) {
      if(!window.package) {
        var domain = !window.cordova && String(window.location)
            .match(/https?:\/\/([^\/]+)/)

        if(domain) {
          domain = domain[0]
        }    

        ajax({
          url:params && params.url ? params.url : domain+PACKAGE,
          fallback: [
              { url: PACKAGE } //for testing
            , params && params.fallback ? params.fallback : { url: __dirname+PACKAGE }
            , { url: '../'+PACKAGE }
            , { url: '../../'+PACKAGE }
            , { url: '../../../'+PACKAGE }
          ],
          complete:function(data) {
            window.package = data
            if(callback) callback(data)
          }
        })
        console.warn('cannot find package.json trying common paths')
      } else if(callback) {
        callback(window.package)
      }
    }
  }
}

blar = exports


exports.inject = function() {
  exports._checks = util.arg(arguments)
  return exports
}

exports.loop = function(obj, option, pckgval, merge, fn, params ) {
  if(fn) {
    var val = option(obj,pckgval,merge, params)
    if(val) { util.merge(obj,val) }
  } else {
    for(var h in obj[option]) {
      if((pckgval===h)) {
        util.merge(obj,merge[h])
        break
      }
    }
  }
}

exports.parse = function(obj, pckg, options, params) {
 if(!(options instanceof Array)) {
    options = [options]
 }
 for(var i in options) {
    for(var check in options[i]) {
      var pckgval = util.get(pckg,check)
        , option = options[i][check]
      exports.loop(obj, option, pckgval, obj[options[i][check]], typeof option === 'function',params)
    }
  }
  return obj
}
