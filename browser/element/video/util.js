/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */
exports.time = function(time, decimals) {
  var hrs = ~~ (time / 3600),
    mins = ~~ ((time % 3600) / 60),
    secs = decimals ? (time % 60).toFixed(decimals) : ~~(time % 60);
  ret = "";
  if (hrs > 0) ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret || 0;
};