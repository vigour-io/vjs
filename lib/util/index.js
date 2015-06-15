// index.js
var Base = require('../base')

//making these kind of util 
//functions is a very fast way to work (they get extra optmizid if used by everything)

exports.isObj = function(obj) {
  //instanceof is slower then typeof (20%)
  return (typeof obj === 'object' && !(obj instanceof Base))
}