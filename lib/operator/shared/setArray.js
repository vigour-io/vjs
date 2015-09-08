"use strict";

var set = require('../').prototype.set

exports.$define = {
  set:function(val){
    if(val.constructor === Array){
      var length = val.length
      var v = val[0]
      var obj = typeof v === 'object' ? v : {$val:v}
      var key = this.$key
      var next = obj
      var i = 1
      for (; i < length; i++) {
        v = val[i]
        next = next[key] = typeof v === 'object' ? v : {$val:v}
      }
      arguments[0] = obj
      set.apply(this, arguments)
    }else{
      set.apply(this, arguments)
    }
  }
}