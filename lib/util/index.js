// index.js
var Base = require('../base')

//making these kind of util functions 
//is a very fast way to work (they get extra optimized by v8 if used by everything)

//instanceof is slower then typeof (15%), this goes against popular believe
exports.isObj = function(obj) {
  return (typeof obj === 'object' && !(obj instanceof Base))
}