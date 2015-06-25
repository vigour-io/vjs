"use strict";
var Base = require('../../')
var proto = Base.prototype
var Operator = require('./')

var forEach = require('lodash/collection/forEach')
var define = Object.defineProperty

var Results = require('./results')

//also use Array type for this

//Results word de vervanging voor selection
//observable!

//todo -- maak $.
//$. voor methods
//$.map
//$.each
//$.filter
//add translations voor alle operators
//allemaal alles supporten?
//normal objects en vobj
//of gewoon vobj results obj maken

proto.$flags = {
  $map: require('./map'),
  $add: require('./add'),
  $transform: require('./transform')
}
