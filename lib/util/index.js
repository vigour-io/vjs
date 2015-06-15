// index.js
var Base = require('../base')

//making these kind of util functions 
//is a very fast way to work (they get extra optimized by v8 if used by everything)

//instanceof object is slower then typeof (15%), this goes against popular believe
//also faster then using lodash isObj (the check is not as solid but we dont support old platforms)
//it does not check for plain Obj but check for non-vigour objects
exports.isPlainObj = function(obj) {
  return (typeof obj === 'object' && !(obj instanceof Base))
}