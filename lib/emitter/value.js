"use strict";
var Emitter = require('./index.js')

module.exports = new Emitter({
  $define:{
    $executePostponed:false
  }
}).$Constructor