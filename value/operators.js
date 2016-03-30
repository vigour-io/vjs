/**
 * operators
 * operators can be set on V.Value.operators
 * define operators on this module
 * @property
 */
var util = require('../util')
  , V = require('../')

exports.add = function( val, operator ) {
  return val + operator
}
exports.sub = function( val, operator ) {
  return val - operator
}
exports.multiply = function( val, operator ) {
  return val * operator
}
exports.divide = function( val, operator ) {
  return val / operator
}
exports.max = function( val, operator ) {
  return val > operator ? operator : val
}
exports.min = function( val, operator ) {
  return val < operator ? operator : val
}
exports.transform = function( val, operator ) {
  return operator===false ? val : operator
}
exports.abs = function( val, operator ) {
  return operator ? Math.abs(val) : val
}
exports.floor = function( val, operator ) {
  return val | 0
}
exports.ceil = function ( val, operator ) {
  return Math.ceil( val )
}
exports.$convertType = function ( val, operator ) {
  //convertType
  if( operator === 'boolean' )
  { 
    return val ? true : false
  } 
  else if( operator === 'number' )
  {
    //do isNan start using loDash for this kind of stuff ( almost nothing )
    //convert falsy or NaN values to 0
    return Number( val )
  }
}

exports.default = function( val, operator ) {
  if( !val && val !== 0 )
  {
    //TODO: Arrays for default operator
    return operator
  }
  return val
}
exports.default.order = 1000