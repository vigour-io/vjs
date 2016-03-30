var ua = require('../../browser/ua')
  , util = require('../')
  , Data = require('../../data').inject(require('../../data/selection'))
/*
selection!

*/
bla = exports

exports.parse = function(obj, pckgval, merge, params) {
  var _ua = ua

  if(params && params.ua) {
    _ua = ua.parse(params.ua.toLowerCase(),{})
  }

  // console.log('HERE!',obj,pckgval,merge)
  var cond
    , uaclone = new Data({bla:util.clone(_ua)})

  if(obj.ua) {
    for(var i in obj.ua) {
      if(_ua.platform===i||_ua.device===i||_ua.browser===i) {
        return obj.ua[i]
      } else if(obj.ua[i].condition) {
        if(!cond) {
          cond = new Data(uaclone, obj.ua[i])
        } else {
          cond.filter = obj.ua[i]
        }
        if(cond.length) {
          delete obj.ua[i].condition
          cond.remove()
          return obj.ua[i]
        }
      }
    }
  }


  //blabla

  // console.log('SUBOBJ???',obj)


  delete obj.subsObj

  if(cond) cond.remove()
}

