/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Youri Daamen, youri@vigour.io
 */
var ua = require('../ua'),
  RAF = 'equestAnimationFrame',
  CAP = 'R' + RAF,
  util = require('../../util')
  lastFrame = 0;

util.define(ua, 'hasTransition', {
  get:function() {
    if(!ua._hasTransition) {
       var b = document.body || document.documentElement
        , s = b.style
        , p = 'ransition';
      ua._hasTransition = typeof s['t'+p] === 'string' 
        || typeof s[ua.prefix + 'T'+p] === 'string'
    }
    return ua._hasTransition
  }
})
  
RAF = 'r' + RAF;
if (!window[RAF]) { 

  ua.noRaf = true

  //window[ua.prefix + CAP] || 

  window[RAF] = function(callback) {
    return setTimeout(callback, 20);
  };
  window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}



module.exports = window[RAF]
//check ios 6 paul irish says stuff goes wrong there...