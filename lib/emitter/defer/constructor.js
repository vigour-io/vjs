"use strict";
var Base = require('../../base')

var set = Base.prototype.set

module.exports = new Base({
  $key:'$defer',
  $flags: {
    $cancel: function(val) {
      //change update?
      console.log('set cancel!')
      this.$cancel = val
    }
  },
  $define: {
    set: function() {
      console.log('hey a set on defer!', arguments)
      return set.apply( this, arguments )
    }
  }
})
