/*!
 * @license Copyright (c) 2012-2014, Vigour. All rights reserved.
 * @author: Marcus Besjes, marcus@vigour.io
 */
var data = require('./'),
  cnt = 0,
  handleTest = module.exports = function(test, subsObj) {
    // console.error('handleTest!', test)
    if (test instanceof Object) {
      var keys = Object.keys(test);
      if (keys.length === 1) {
        var key = keys[0]
          , valcheck = handleField(key, test[key], subsObj)
          
        return subsObj._check = function(doc){
          // console.log('TESTING', test, doc && doc.raw)
          // console.log('checking for key', key)
          var val = getValue(doc)
          return valcheck(val)
        }
      } else {
        var list = [],
          key;
        for (var k = 0, l = keys.length; k < l; k++) {
          key = keys[k];
          list.push(handleField(key, test[key], subsObj));
        }
        return subsObj._check = makeAND(list);
      }
    } else {
      return subsObj._check = function(doc) {
        return getValue(doc) === test;
      }
    }
  }

function handleField(key, value, subsObj) {
  // console.warn('handleField [', key, '] value', value)
  var check;
  switch (key) {
    case '$not':
      if (value instanceof Object) {
        var follow = handleTest(value, subsObj);
        check = function(doc) {
          return follow(doc) === false;
        };
      } else {
        check = function(doc) {
          return doc !== value;
        };
      }
      break;
    case '$ne':
      check = function(doc) {
        return doc !== value;
      };
      break;
    case '$and':
      var list = makeList(value, subsObj);
      check = makeAND(list);
      break;
    case '$nand':
      var list = makeList(value, subsObj);
      check = function(doc) {
        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i](doc) === false) return true;
        }
        return false;
      };
      break;
    case '$or':
      var list = makeList(value, subsObj);
      check = function(doc) {
        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i](doc)) return true;
        }
        return false;
      };
      break;
    case '$nor':
      var list = makeList(value, subsObj);
      check = function(doc) {
        for (var i = 0, l = list.length; i < l; i++) {
          if (list[i](doc)) return false;
        }
        return true;
      };
      break;
    case '$every':
      subsObj.set('$', {});
      // subsObj.$ = {
      //   _up: subsObj
      // };
      var follow = handleTest(value, subsObj.$);
      check = function(doc) {
        if (doc && doc.__t < 3) {
          var result = true;
          doc.each(function() {
            if (!follow(this)) return !(result = false);
          });
          return result;
        } else {
          return false;
        }
      };
      break;
    case '$nevery':
      subsObj.set('$', {});
      // subsObj.$ = {
      //   _up: subsObj
      // };
      var follow = handleTest(value, subsObj.$);
      check = function(doc) {
        if (doc && doc.__t < 3) {
          var result = false;
          doc.each(function() {
            if (!follow(this)) return result = true;
          });
          return result;
        } else {
          return true;
        }
      };
      break;
    case '$':
    case '$some':
      subsObj.set('$', {});
      // subsObj.$ = {
      //   _up: subsObj
      // };
      if (value instanceof Object) {
        var follow = handleTest(value, subsObj.$);
        check = function(doc) {
          if (doc && doc.__t < 3) {
            var found;
            doc.each(function() {
              if (follow(this)) return found = true;
            });
            return found || false;
          }
          return false;
        };
      } else {
        check = function(doc) {
          if (doc && doc.__t < 3) {
            var found;
            doc.each(function() {
              if (this === value) return found = true;
            });
            return found || false;
          }
          return false;
        };
        subsObj.$._check = function(doc) {
          return doc === value;
        };
      }
      break;
    case '$nsome':
      subsObj.set('$', {});
      // subsObj.$ = {
      //   _up: subsObj
      // };
      var follow = handleTest(value, subsObj.$);
      check = function(doc) {
        if (doc && doc.__t < 3) {
          var result = true;
          doc.each(function() {
            if (follow(this)) return !(result = false);
          });
          return result;
        } else {
          return true;
        }
      };
      break;
    case '$lt':
      check = function(doc) {
        // console.log('burk lt', doc, value)
        return doc < value;
      };
      break;
    case '$lte':
      check = function(doc) {
        return doc <= value;
      };
      break;
    case '$gt':
      check = function(doc) {
        return doc > value;
      };
      break;
    case '$gte':
      check = function(doc) {
        return doc >= value;
      };
      break;
    case '$contains':
      var regex = new RegExp(value, 'i');
      check = function(doc) {
        return regex.test(doc);
      };
      break;
    case '$ncontains':
      var regex = new RegExp(value, 'i');
      check = function(doc) {
        return !regex.test(doc);
      };
      break;
    case '$containsall':
      break;
    case '$ncontainsall':
      break;
    case '$has':
      check = function(doc) {
        return doc && doc[value] !== void 0;
      };
      break;
    case '$nhas':
      check = function(doc) {
        return !doc || doc[value] === void 0;
      };
      break;
    case '$exists':
      check = function(doc) {
        return (doc !== void 0 && doc !== null) === value;
      };
      break;
    case '$in':
      check = function(doc) {
        for (var i = 0, l = value.length; i < l; i++) {
          if (doc === value[i]) return true;
        }
        return false;
      };
      break;
    case '$nin':
      check = function(doc) {
        for (var i = 0, l = value.length; i < l; i++) {
          if (doc === value[i]) return false;
        }
        return true;
      };
      break;
    case '$regex':
      check = function(doc) {
        return value.test(doc);
      }
      break;
    default:
      if (value instanceof Object) {
        var dsubsObj = subsObj[key];

        if (dsubsObj) {
          // console.log('already made that dsubsObj with key', key);
          // dsubsObj._up = subsObj
        } else {
          subsObj.set(key, {});
          dsubsObj = subsObj[key];
        }
        var follow = handleTest(value, dsubsObj);

        check = function(doc) {
          // console.log('TESTING: check OBJECT', doc && doc.raw || doc, 'for field', key)
          doc = getField(doc, key)

          // console.log('wups', doc && doc.raw || doc)
          return follow(doc);
        };
      } else {
        check = function(doc) {
          doc = getField(doc, key)
          
          // doc = getValue(doc)
          // console.log('TESTING: check VALUE', doc && doc.raw || doc, value, doc === value)
          return doc === value;
        };
        subsObj.set(key, {});
        subsObj[key]._check = check
        // subsObj[key] = {
        //   _up: subsObj,
        //   _check: function(doc) {
        //     return doc === value;
        //   }
        // };
      }

  }
  return subsObj ? subsObj._check = check : check;
}

function makeList(arr, subsObj) {
  var list = [];
  for (var i = 0, l = arr.length; i < l; i++) {
    list.push(handleTest(arr[i], subsObj));
  }
  return list;
}

function makeAND(list, subsObj) {
  return function(doc) {
    var val = getValue(doc);
    for (var i = 0, l = list.length; i < l; i++) {
      if (list[i](val) === false) return false;
    }
    return true;
  };
}

function getValue(thing){
  var val = thing && thing.from && thing.from.val
  return val !== void 0 ? val : thing
  
}
function getField(thing, field){
  // console.error('getField field', field, 'from', thing && thing.raw || thing)
  thing = getValue(thing)
  return thing ? getValue(thing[field]) : void 0
}