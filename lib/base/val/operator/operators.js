"use strict";

var Base = require('../../')

Base.prototype.$flags = {
  $map: require('./map'),
  $add: require('./add'),
  $prepend: require('./prepend'),
  $transform: require('./transform')
}

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


