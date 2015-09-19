"use strict";
module.exports = function onUpward( event, meta, subsemitter, refLevel, level, val, original ) {
  var parent = this.$parent
  subsemitter.$subscribeUpward( parent, val, event, refLevel, level + 1, true, original )
}
