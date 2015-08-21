"use strict";

exports.$define = {
  $stamp: {
    get: function getStamp() {
      var stamp = this.$on && this.$on.$change && this.$on.$change.$lastStamp
      return stamp
    },
    set: function setStamp() {

    }
  }
}
