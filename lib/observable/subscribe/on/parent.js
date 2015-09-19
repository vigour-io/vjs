"use strict";
module.exports = function onParent( event, meta, subsemitter, refLevel, level, val, original ) {
  var parent = this.$parent
  var value = val.$parent
  console.log('parent allo!',window.allo && window.allo.$path)
  console.log('parent this!',this.$path,this.$key)
  subsemitter.$subscribeToProperty( parent, val, '$parent', event, refLevel, level, true, original )
}
