"use strict";
module.exports = function() {
  return JSON.stringify(this.$convert({
    fnToString: true
  }), false, 2)
}