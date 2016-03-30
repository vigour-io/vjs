/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */
var animation = require('./');
animation.easing = exports;
// t: current time, b: beginning value, c: change In value, d: duration
// courtesy of Robert Penner
exports.inCubic = function(t, b, c, d) {
  return c * (t /= d) * t * t + b;
};

exports.outCubic = function(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
};

exports.outBack = function(t, b, c, d, s) {
  var s = 1.70158;
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};