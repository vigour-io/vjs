// event.js
var stamp = 0
var define = Object.defineProperty
var Base = require('../index.js')

var Event = module.exports = function Event(){
  this.$stamp = stamp++
  //this is slow!
  // this.$postponed = []
}

define( Event.prototype, '$toString' , {
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

