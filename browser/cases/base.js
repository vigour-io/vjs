/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */

var cases = require('./'),
  element = require('../element'),
  setFlags = require('../element/set'),
  base = require('../../base'),
  util = require('../../util');

//------------------CASES FOR SET-------------------------------
var _css = function(t, name, invert, remove) {
    if (!invert) {
      t.css = remove ? {
        removeClass: name
      } : {
        addClass: name
      };
    }
  },
  methods = cases.methods;

setFlags.remove = function(i, val, copy, top) {
  //this could become a seperate module since remove may be usefull for different purposes
  if (val && val.__remove__) {
    if (this[i] instanceof base) {
      top[i] = false;
    } else if (util.lookup.call(this, i)) {
      delete val.__remove__;
    } else {
      delete val[i];
      return true;
    }
  }
};

setFlags.cases = methods.reader(function(name, val, dynamic, invert) {
  var t = this,
    f = function(obj) {
      obj = base.set(obj, false, true);
      for (var i in obj) {
        if (util.isObj(obj[i])) {
          obj[i] = f(obj[i]);
        }
      }
      return obj;
    },
    method,
    parsed,
    set,
    sVal,
    original;
  val = f(val);

  if (dynamic) {
    if (!t._cases) {
      t._cases = {};
    }
    if (val === null) {
      if (t._cases[name].method) {
        // console.error(name, 'case === null , remove it');
        cases[name].removeListener(t._cases[name].method);
      }
      if (cases[name].val) {
        t.css = {
          removeClass: name
        };
      }
      delete t._cases[name]; //removes case orginal
    } else {
      // console.error('SET CASE',name,t._cases[name]&&t._cases[name].method);
      parsed = methods.original(t, true, val, t._cases, true, name);
      t._cases[name] = {
        val: val,
        orig: parsed[0],
        nested: parsed[1]
      };

      if (!t._cases[name].method) {
        // console.error('this is what i have set for original', t._cases);
        method = t._cases[name].method = function() {
          // console.log('LETS TRY TO RUN METHOD',name);
          if (val) {
            set = methods.merge(true, name, val, t._cases); //arg no val;
            sVal = set [0];
            original = set [1];
            delete sVal.val;
            delete original.val;
            if (cases[name].val) {
              _css(t, name, invert);
              t.set(sVal, true);
            } else {
              _css(t, name, invert, true);
              t.set(original, true);
            }
          }
        };
        // console.error('ADD LISTENER TO',name,  t._cases[name]);
        cases[name].addListener(method);
        //remove setting on remove (saves memory)
        t.setSetting({
          name: '_c' + name,
          remove: function() {
            // console.log('remove from setting case', name);
            cases[name].removeListener(method);
          }
        });
        // } else {
        // console.log(name, 'already got listeners for case',name);
      }
      if (cases[name].val) {
        _css(t, name, invert);
        t.set(val, true);
      }
    }
  } else {
    _css(t, name, invert);
    t.set(val); //maybe copy args?
  }
  return true;
});