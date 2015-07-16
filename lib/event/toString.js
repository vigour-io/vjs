"use strict"
// toString.js
var Event = require('./index.js')
var define = Object.defineProperty
var Base = require('../base')

define( Event.prototype, 'toString' , {
  value: function() {
    var str = ''
    for(var key$ in this) {
      if(key$ === '$postponed') {
        str+='\n'+key$+ ' : '
        for(var i in this[key$]) {
          // console.info(key$,this[key$])
          str+= '\n  > '+this[key$][i].$path.join('.')
        }
      } else {
        str+= '\n'+key$ + ' : ' + (this[key$] instanceof Base
           ? this[key$].$path
           : this[key$])
      }
    }
    return str
  }
})
