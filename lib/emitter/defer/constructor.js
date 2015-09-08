"use strict";
var Base = require('../../base')
var set = Base.prototype.set
var remove = Base.prototype.remove

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
    remove: function() {
      console.log('clearly removing defer!')
      if( this.$inProgress ) {
        console.error('lezz cancel!')
        if( this.$cancel ) {
          this.$cancel.call( this.$inProgress.bind, this.$inProgress.event, this )
        }
      }
      return remove.apply( this, arguments )
    },
    set: function() {
      console.log('hey a set on defer!', arguments)
      return set.apply( this, arguments )
    }
  },
  $inject: require('./exec.js')
})
