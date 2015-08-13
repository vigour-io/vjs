"use strict"
var Base = require('../base')
var Event = require('./')

exports.toString = function() {
  var str = ''
  for( var key$ in this ) {
    if( key$ === '$postponed' ) {
      str+='\n'+key$+ ' : '
      for( var i in this[key$] ) {
        // console.info(key$,this[key$])
        str+= '\n  > '+this[key$][i].$path.join('.')
      }
    } else {
      str+= '\n'+key$ + ' : ' + (this[key$] instanceof Base
         ? this[key$]._$path + ' ---- ' + this[key$].$path
         : this[key$])
    }
  }
  return str
}
