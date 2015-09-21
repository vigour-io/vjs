'use strict'
// listeners
module.exports = function onChange ( event, meta, subsemitter, refLevel, level, map ) {
  if ( meta ) {
    // dirty! updating entire subscription, if there is refs
    var subsOrigin = subsemitter._$parent._$parent
    if ( subsOrigin._$input) {
      subsemitter.$loopSubsObject(subsOrigin, subsemitter._$pattern, event, 1, level, void 0, true)
    }
  }

  subsemitter._execEmit(this, map, refLevel, event)
}
