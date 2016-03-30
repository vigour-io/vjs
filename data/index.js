/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var V = require('../'),
  object = require('../object'),
  util = require('../util');

module.exports = exports = V.Data = object.new();
exports.prototype._blacklist.push('__sub','__block');
util.define(exports, '_hook', function(val, obj) {
  if (obj.subscription) {
    this.__sub = obj.subscription;
    delete obj.subscription;
  }
  if(obj.block) {
    this.__block = true
    delete obj.block
  }
});

