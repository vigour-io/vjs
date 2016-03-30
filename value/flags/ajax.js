/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var flags = module.exports = require('./'),
  ajax = require('../../browser/network/ajax'),
  object = require('../../object'),
  util = require('../../util');

/**
 * ajax
 * val should call an ajax request
 * @flag
 */
flags.ajax = {
  set: function(params, stamp, reset) {
    var current = this.checkParent('_prop.name'),
      name = current._prop.name;
    if (params) {
      this.set('transform', function(val, op) {
        var ajaxField = this._ajax,
          load, id = val._id;
        if (op && (!id || !(ajaxField && ajaxField[val._id]))) {
          id = val._id = (name || this.stamp());
          if (!ajaxField) {
            ajaxField = (this._ajax = {});
          }
          ajaxField[id] = true;
          load = params === true ? {} : util.clone(params);
          load.url = op;
          var cc = load.complete,
            instance = this,
            t = val._parent;
          load.complete = function(data) {
            data = (cc ? (cc.call(instance, data) || data) : data);
            if (name) {
              instance[name] = {
                val: data,
                transform: null
              };
            } else {
              t.val = data;
            }
          };
          ajax(load);
        }
        return '';
      });
    }
  }
};