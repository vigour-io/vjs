"use-strict";

var makeTest = exports.makeTest = function (conditions, subsObj) {
  var val = getValue(conditions)
  if(typeof conditions === 'object') {
    var keys = getKeys(conditions)
    var length = keys.length
    if(length === 1) {
      var key = keys[0]
      return makeKeyTest(key, conditions[key], subsObj)
    } else if(length) {
      return makeAND(conditions, subsObj)
    } else {
      console.error('empty conditions object?')
      return alwaysTrue
    }
  }
}

function makeKeyTest(key, value, subsObj) {
  var test
  
  value = value && value.$val

  switch (key) {
    case '$not':
      if (value instanceof Object) {
        var follow = makeTest(value, subsObj)
        test = function(doc) {
          return follow(doc) === false
        }
      } else {
        test = function(doc) {
          return doc !== value
        }
      }
      break;
    case '$ne':
      test = function(doc) {
        return doc !== value
      }
      break
    case '$and':
      test = makeAND(value)
      break;
    case '$nand':
      var and = makeAND(value)
      test = function(doc) {
        return !and(doc)
      }
      break
    case '$or':
      test = makeOR(value)
      break
    case '$nor':
      var or = makeOR(value)
      test = function(doc) {
        return !or(doc)
      }
      break
    case '$every':

      if(value instanceof Object) {
        var follow = makeTest(value, subsObj)
        test = function(doc) {
          var result = doc && doc.$each && true
          if(result) {
            doc.$each(function(){
              if(!follow(getValue(this))) {
                result = false
                return true
              }
            })
          }
          return result || false
        }  
      } else {
        test = function(doc) {
          var result = doc && doc.$each && true
          if(result) {
            doc.$each(function(){
              if(getValue(this) !== value) {
                result = false
                return true
              }
            })
          }
          return result || false
        }
      }
      break
    case '$nevery':
      var every = makeKeyTest('$every', value)
      test = function(doc) {
        return !every(doc)
      }
      break
    case '$':
    case '$any':
      if(value instanceof Object) {
        var follow = makeTest(value, subsObj)
        test = function(doc) {
          var result = doc && doc.$each
          if(result) {
            result = false
            doc.$each(function(){
              if(follow(getValue(this))) {
                return result = true
              }
            })
          }
          return result || false
        }  
      } else {
        test = function(doc) {
          var result = doc && doc.$each
          if(result) {
            result = false
            doc.$each(function(){
              if(getValue(this) === value) {
                return result = true
              }
            })
          }
          return result || false
        }
      }
      break
    case '$nany':
      var any = makeKeyTest('$any', value)
      test = function(doc){
        return !any(doc)
      }
      break
    case '$lt':
      test = function(doc) {
        return doc < value
      }
      break
    case '$lte':
      test = function(doc) {
        return doc <= value
      }
      break
    case '$gt':
      test = function(doc) {
        return doc > value
      }
      break
    case '$gte':
      test = function(doc) {
        return doc >= value
      }
      break
    case '$contains':
      if(!(value instanceof RegExp)) {
        value = new RegExp(value, 'i')
      }
      test = function(doc) {
        return value.test(doc)
      }
      break
    case '$ncontains':
      if(!(value instanceof RegExp)) {
        value = new RegExp(value, 'i')
      }
      test = function(doc) {
        return !value.test(doc)
      }
      break
    // case '$containsall':
    //   break;
    // case '$ncontainsall':
    //   break;
    case '$has':
      test = function(doc) {
        return doc && doc[value] !== void 0
      };
      break;
    case '$nhas':
      test = function(doc) {
        return !doc || doc[value] === void 0
      };
      break;
    case '$exists':
      test = function(doc) {
        return (doc !== void 0 && doc !== null) === value
      }
      break
    case '$nexists':
      test = function(doc) {
        return (doc === void 0 || doc === null) === value
      }
      break
    case '$in':
      var list = []
      value.$each(function(){
        list.push(getValue(this))
      })
      test = function(doc) {
        for (var i = 0, l = list.length; i < l; i++) {
          if (doc === list[i]) return true
        }
        return false
      }
      break
    case '$nin':
      var list = []
      value.$each(function(){
        list.push(getValue(this))
      })
      test = function(doc) {
        for (var i = 0, l = list.length; i < l; i++) {
          if (doc === list[i]) return false
        }
        return true
      }
      break
    default:
      if (value instanceof Object) {
        var nextSubsObj = subsObj[key]
        if(!nextSubsObj) {
          subsObj.$setKey(key, {})
          nextSubsObj = subsObj[key]
        }

        var follow = makeTest(value)
        test = function(doc) {
          doc = getPropertyValue(doc, key)
          return follow(doc)
        }
      } else {
        test = function(doc) {
          doc = getPropertyValue(doc, key)
          return doc === value
        }
        subsObj.set(key, {})
        subsObj[key]._check = check
      }
  }

  return test

}

function getValue(base) {
  base = base.$origin
  return base.$val
}

function getPropertyValue(base, key) {
  base = base.$origin
  base = base[key]
  if(base) {
    return getValue(base)
  }
}

function getKeys(base) {
  var keys = []
  for(var k in base) {
    if(k[0] !== '_' && k !== '$bind'){
      console.log('key', k)
      keys.push(k)
    }
  }
  return keys
}

function alwaysTrue(){
  return true
}

function makeList(value) {
  var list = []
  value.$each(function(){
    list.push(makeTest(this))
  })
  return list
}

function makeAND(value) {
  var testList = makeList(value)
  return function(doc) {
    for (var i = 0, l = testList.length; i < l; i++) {
      if (!testList[i](doc)) {
        return false
      }
    }
    return true
  }
}

function makeOR(value) {
  var testList = makeList(value)
  return function(doc) {
    for (var i = 0, l = testList.length; i < l; i++) {
      if (testList[i](doc)) {
        return true
      }
    }
    return false
  }
}
