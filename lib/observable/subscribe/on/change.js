"use strict";
//listeners
module.exports = function onChange( event, meta, subsemitter, refLevel, level, resolvedPath, original ) {

  console.error('change fires!')

  if( meta ) {
    //dirty! updating entire subscription, if there is refs
    var subsOrigin = subsemitter._$parent._$parent
    if( subsOrigin._$input ) {
      subsemitter.$loopSubsObject( subsOrigin, subsemitter._$pattern, event, 1, level )
    }
  }

  var subsPath = subsemitter._$parent._$parent._$path
  var myObservableResolved
  var temp = refLevel > 1 ? original : this

  for(var i in resolvedPath) {
    temp = temp[resolvedPath[i]]
  }

  if(temp) {
    myObservableResolved = temp
    myObservableResolved.emit( subsemitter.$key, event )
  } else {
    console.error('cant find', resolvedpath, 'from:', this._$path)
  }
}
