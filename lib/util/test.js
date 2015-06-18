module.exports = exports = function( subject, conditions ){
  for (var condition$ in conditions) {
    if( exports[condition$] ){
      if( !exports[condition$]( subject, conditions[condition$]) ){
        return false
      }
    }else{
      console.warn(condition$,'is not an existing condition')
    }
  }
  return true
}
exports.$equals = function( subject, value ){
  return subject === value || subject._$val === value
}
exports.$nequals = function( subject, value ){
  return subject !== value && subject._$val !== value
}