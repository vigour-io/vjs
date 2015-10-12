'use strict'
// lets make this into an array like object
// fix key moving! (make it special -- think about context)
var Observable = require('../../observable')

var result = new Observable({
  key: '_cache'
})

module.exports = result.Constructor
