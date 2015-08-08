"use strict";
//-----------injectable part of the module----------

exports.$define = {
  subscribe: function(subsObj, handler, event) {
    console.error('public subscribe method called')

    // this.$set({
    //   $subscriptions:{
    //     $change: handler
    //   }
    // }, event)

  }
}

// how to do this? subscribe just uses on!
exports.$flags = {
  $subscriptions: require('./constructor')
}
