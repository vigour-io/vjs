/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */

var flags = require('../../value/flags'),
  Cases = require('./'),
  object = require('../../object'),
  util = require('../../util'),
  methods = Cases.methods,
  dynamic = {
    set: function(val, stamp, reset, name) {

      if(!this._flag) this._flag = {}

      var t = this,
          //selection for t._flag easy maken
          
          
        flags = t._flag.case || (t._flag.case = [
          'case',
          t._val,
          false, {},
          dynamic
        ]),
        cases = flags[3],
        isObj = util.isObj(val),
        setVal = (isObj && !val.val) ? false : true;
      if (val === null) {
        if (cases[name]) {
          Cases[name].removeListener(cases[name].method);
        }
        delete cases[name];
      } else {
        flags[5] = true;
        if (!cases[name]) {
          var x = methods.original(t, isObj, val, cases, false, name);
          cases[name] = {
            val: val,
            orig: x[0],
            nested: x[1],
            method: function() {
              var set = methods.merge(isObj, name, val, cases),
              sVal = set[0],
              original = set[1];
              flags[5] = true; //the closures here are not really nessecary better to avoid
              if (Cases[name].val) {
                if(!sVal) console.warn(name,'wrong in cases!', sVal, Cases, flags)
                if (setVal && sVal) {
                  flags[1] = sVal.val || sVal;
                }
                t.val = sVal;
              } else {
                if (setVal) flags[1] = original && original.val || original
                t.val = original;
              }
              flags[5] = null;
            }
          };
          Cases[name].addListener(flags[3][name].method);
        }
        if (Cases[name].val) {
          if (setVal) {
            flags[1] = val.val || val;
          }
          object.set.call(t, val, stamp, false, true);
          //not always
          t._ignorefornow = true

        }
        flags[5] = null;
      }
    },
    // reset:function() {
      // console.error('reset')
    // },
    //add reset later
    remove: function(flags, name) {
      // console.log(flags, name)
      var cnt = 0
      for (var i in flags[3]) {
        // if(flags[3])
        cnt++
        if(!this._ignorefornow && !name || i===name) {
          cnt --
          Cases[i].removeListener(flags[3][i].method);
        } else {
          delete this._ignorefornow
        }
      }
      if(cnt) {
        // console.log('CASE OBJECT REMOVAL --- IT IS NOT EMPY')
        return true
      }
    },
    stack: 'case'
  },
  _static = {
    set: function(val, stamp, reset, name) {
      if (val !== null) {
        object.set.call(this, val, stamp, false, true);
      }
    }
  };

flags.dynamic.cases = methods.reader(false, dynamic, _static);