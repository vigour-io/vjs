"use strict";
module.exports = function onParent( event, meta, subsemitter, refLevel, level, val, original ) {
  var parent = this.$parent
  var value = val.$parent
  subsemitter.$subscribeToProperty( parent, val, '$parent', event, refLevel, level, true, original )
}
