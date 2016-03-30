/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Jim de Beer, jim@vigour.io
 */

var object = require('../../object'),
  util = require('../../util'),
  element = require('../element'), //element /w extend
  value = require('../../value'),
  flags = require('../../value/flags');

/**
 * cases
 * cases are used to set one or more values when a specific case is true
 * there are 2 types of cases , static and dynamic ,
 * static cases are set at initialization of the application , usefull for things such as device type (phone, desktop, tv)
 * dynamic cases can be changed dynamicly and Objects or Bases that use the case will be changed dynamicly as well
 */

util.define(exports, 'methods', {});
//multiple, recursive and original have to become extensions on V.Object.convert so it's possible to use the same for data and events

var _isObj = util.isObj,
  /*
    _recur
    special merge that adds __remove__ if a field has to be removed
  */
  _recur = function(original, merge, fieldExists) {

    // console.log(original, merge, fieldExists)

    var keys, i, key, originalChild, mergeChild;
    if (fieldExists) {
      keys = {};
      for (key in original) {
        keys[key] = true; //keys can be undefined -- code can become shorter
      }
    }
    for (i in merge) {
      if (!fieldExists || keys[i]) {
        originalChild = original[i];
        mergeChild = merge[i];
        if (originalChild instanceof Object) {
          if (originalChild.__remove__ && (mergeChild && !mergeChild.__remove__)) {
            delete originalChild.__remove__;
          }
          if (!(mergeChild instanceof Object)) {
            merge[i] = {
              val: mergeChild
            };
          }
          _recur(originalChild, mergeChild, fieldExists);
        } else {
          original[i] = mergeChild;
          originalChild = 'burn';
        }
      }
    }
  },
  /*
          _multiple
          merge multiple orginals into a new orginal object also resolve nested cases
      */
  _multiple = function(t, nested, cases, currentObj, currentVal, base, name, path, orig) {

    if (!path) {
      orig = t;
      path = [];
    }
    var j, _case, cvChild;

    if((currentVal instanceof object) && !base) {

      // currentObj.val = t._val
      // console.error('VOBJ', currentObj)


    } else if (currentVal instanceof Object) {
      for (j in currentVal) {
        cvChild = currentVal[j];
        if (exports[j]) {
          _case = exports[j];
          if (_case instanceof object) {
            if (!base || !element.set.lookup.call(orig, path[path.length - 1])) { //element is required in cases.base, make this part extendable
              nested[j] = true;
            }
          }
          if (!_isObj(cvChild)) {
            currentObj.val = t && (t._val !== void 0 ? t._val : void 0);
          } else {
            path.push(j);
            //should be possible to use nested for current nested case;
            _multiple(t, nested, cases, currentObj, cvChild, base, name, path, orig);
          }
          currentObj[j] = null;
        } else {
          if (_isObj(cvChild)) {
            if (!currentObj[j]) {
              currentObj[j] = (t && t[j] && t[j].convert && t[j].convert(cvChild)) || (cvChild instanceof Array ? [] : {});
            }
            path.push(j);
            _multiple(t && t[j], nested, cases, currentObj[j], cvChild, base, name, path, orig);
            if (base && (!t || !t[j])) {
              currentObj[j].__remove__ = true;
            }
          } else {
            if (t && currentObj && !currentObj[j]) {
              if (flags[j]) {
                delete currentObj[j];
                currentObj.val = t._val !== void 0 ? t._val : void 0;
              } else {
                currentObj[j] = j === 'val' 
                  ? (t._val !== void 0 ? t._val : void 0) 
                  : (t[j]!==void 0 && t[j].convert && t[j].convert())
              }
            }
          }
        }
      }
    }
  };

/*
      original
      create a orginal store for a new case
    */
exports.methods.original = function(t, isObj, val, cases, base, name) {



  var obj = isObj ? t.convert(val) : t._val,
    i, cflag, nested = {};

  _multiple(t, nested, cases, obj, val, base, name);

  // for(var i in nested) {
  //   console.error('NESTED:::',i);
  // }
  // console.log(base ? 'BASE:': 'PROPERTY:' , name,'ORIGINAL GENERATION','\nval:',val,'\nobj:',obj,'\nnested:',nested,'\ncases:',cases);

  for (i in cases) {
    if (!nested[i]) {
      cflag = cases[i].orig;
      if (!isObj) {
        if (_isObj(cflag)) {
          if (cflag.val) {
            obj = cflag.val;
          }
        } else {
          obj = cflag;
        }
      } else {
        if (_isObj(cflag)) {
          if (!cases[i].nested[name]) {
            _recur(obj, cflag, name);
          }
        } else if (obj.val) {
          obj.val = cflag;
        }
      }
    }
  }



  return [obj, nested];
};
/*
  merge
  merge dynamic cases (overwrite /w cases that are true and further in the order of cases)
*/
exports.methods.merge = function(isObj, name, val, cases) {
  var original = util.clone(cases[name].orig),
    sVal = val,
    overwrite,
    i,
    merge,
    originalChild;
  for (i in cases) {
    if (i !== name && !cases[name].nested[i]) {
      if (exports[i].val) {
        merge = cases[i].val;
        if (_isObj(original) || _isObj(merge)) {
          if (!_isObj(original)) {
            original = {
              val: original
            };
          }
          if (!_isObj(merge)) {
            merge = {
              val: merge
            };
          }
          _recur(original, merge, true);
          for (i in exports) {
            originalChild = original[i];
            if (originalChild !== null && originalChild !== void 0) {
              delete original[i]; //delete is pretty slow
            }
          }
          if (overwrite) {
            if (isObj) {
              if (sVal === val) {
                sVal = util.clone(sVal);
              }
              merge = util.clone(merge);
              for (i in exports) {
                if (merge[i] !== null && merge[i] !== void 0) {
                  // console.error('REMOVE FIX', i);
                  delete merge[i]; //delete is pretty slow
                }
              }
              _recur(sVal, merge, true);
            } else {
              if (merge.val) {
                sVal = merge.val;
              }
            }
          }
        } else {
          original = merge;
        }
      }
    } else {
      overwrite = true;
    }
  }
  return [sVal, original];
};
/*
  reader
  abstraction for use in cases.object and cases.base
*/
exports.methods.reader = function(fn, dynamic, _static) {
  return function(name, val) {
    var invert = (name[0] === '!'),
      vCase = invert ? exports[(name.slice(1))] : exports[name],
      ret;
    if (vCase) {
      if (vCase instanceof object) {
        if (invert && !exports[name]) {
          exports[name] = new value({
            val: function() {
              return !vCase.val;
            },
            listen: vCase
          });
        }
        ret = fn ? fn.call(this, name, val, true, invert) : dynamic;
      } else {
        ret = invert ? !!fn : fn ? fn.call(this, name, val) : _static
      }
    } else if (invert) {
      ret = fn ? fn.call(this, name, val, false, invert) : _static;
    }
    if (vCase === false && fn) {
      ret = true;
    }
    return ret;
  };
};

require('./object');
require('./base');