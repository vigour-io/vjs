"use strict";
var Base = require('../../base')

//----injectable part of module-----
exports.$flags = {
  $defer: require('./constructor')
}
