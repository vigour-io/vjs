/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */
var flags = module.exports = require('./'),
  util = require('../../util'),
  object = require('../../object'),
  ownModel = function(base) {
    if (!base.__ || !base.__.model) { //maybe a utility? use it at different spots like settings
      base.model = {};
      if (!base._.model) {
        base._dListen();
      }
    }
    return base.model;
  };
/**
 * data
 * data adds a reference to the data property of the current base class;
 * if there is not _base.model use data.base.extend(baseClass);
 * @flag
 */
flags.data = {
  useVal:true, //(reset???)
  set: function(val, stamp, reset) {

    var current = this.checkParent('_prop.name'),
      name = current._prop.name,
      base = current._base,
      model = ownModel(base);
    if (model.flags && model.flags[name]) {
      if (!(model.flags[name] instanceof Array)) {
        model.flags[name] = [model.flags[name]];
      }
      if (!util.checkArray(model.flags[name], this)) {
        model.flags[name].push(this);
      }
    } else {
      if (!base.model.flags) {
        base.model.flags = {};
      }
      base.model.flags[name] = this;
    }

    // console.log('LEZZ SET IT!', val, stamp, reset, current)

    var getData = function() {
      var data = this._d;
      if (data === void 0) {
        var parent = this;
        while (data === void 0 && parent) {

          // if(parent.model && (!parent.model.inherit || parent.model.inherit.val!==false)) {
          //   return data
          // }

          if (parent._d) {
            data = this._dSet(parent._d, true);
          } else {
            parent = parent.node.parentNode;
            if (parent) {
              parent = parent.base;
            }
          }
        }
      }
      return data;
    };
    if (val instanceof Object) {
      var v = val.val || val;
      this._val = function() {
        var data = getData.call(this);
        // console.log('---->',v,data)
        return data && v.call(this, data);
      };
      val = val.listen || true;
    } else {
      this._val = function() {
        var data = getData.call(this),
          ret;
        data = val === true ? data : util.get(data, val);
        if (data !== void 0) {
          ret = data.__t && !data._filter && data.val;
          if (!ret && ret !== 0 && ret !== '') { //weird
            ret = data;
          }
        } else {
          ret = '';
        }
        return ret;
      };
    }
    if(!this._flag) this._flag = {}

    // this.__lval = false
    // current._caller.setSetting({
    //   name: name,
    //   parent: function(parent) {
    //     console.log('!@#!@#!@#')
    //     this.updateData()
    //   }
    // });

    this._flag.data = ['data', this._val, val, name];
  },
  remove: function() {
    var current = this.checkParent('_prop.name'),
      model = ownModel(current._base),
      t = this;
    if (model && model.flags) {
      for (var i in model.flags) {
        if (i === current._prop.name) {
          var item = model.flags[i];
          if (item instanceof object || item.length === 1) {
            model.flags[i] = null;
            delete model.flags[i];
          } else {
            model.flags[i].splice(util.checkArray(item, t), 1);
          }
        }
      }
    }
    this._update() //pas hiermee op!
    // var t = this
    setTimeout(function() {
      //deze pas uitvoeren nadat alle klaar is! dit is dirty!
      t._update()
    },0)
  }
};