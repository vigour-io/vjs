module.exports = function flatten(obj, flatKey){
  var target = obj && obj[flatKey]
  if(target) {
    var result = {}
    for(var objKey in obj) {
      if(objKey !== flatKey) {
        result[objKey] = obj[objKey]
      }
    }
    for(var targetKey in target) {
      result[targetKey] = target[targetKey]
    }
    return result
  }
  return obj
}
