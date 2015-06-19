"use-strict";
/**
 * @module test
 * @function
 * @description  Tests if subject meets all given conditions
 * @param  {*} subject The subject to test
 * @param  {*} conditions The conditions to which the subject is tested
 * @return {boolean}
 */
module.exports = exports = function( subject, conditions ){
  for (var condition$ in conditions) {
    if( exports[condition$] ){
      if( !exports[condition$]( subject, conditions[condition$]) ){
        if(condition$[0] !== '!'){
          return false
        }
      }
    }else{
      console.warn(condition$,'is not an existing condition')
    }
  }
  return true
}

/**
 * @function $contains
 * @memberOf test
 * @description Tests if subject equals the given value
 * @param  {*} subject The subject to test
 * @param  {*} value The value the subject should equal
 * @return {boolean}
 */
exports.$equals = function( subject, value ){
  return subject === value || subject._$val === value
}

/**
 * @function $contains
 * @memberOf test
 * @description Tests if subject contains the given value
 * @param  {*} subject The subject to test
 * @param  {*} value The value the subject should contain
 * @return {boolean}
 */
exports.$contains = function( subject, value ) {
  return new RegExp(value, 'i').test(subject)
}