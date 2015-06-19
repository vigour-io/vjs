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
      str+= '\n'+key$ + ' : ' + (this[key$] instanceof Base
        ? this[key$].$path
        : this[key$])
    }
    return str
  }
})

