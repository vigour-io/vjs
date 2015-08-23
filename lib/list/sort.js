var Base = require('../base')
var quickSort = require('../util/quicksort')

exports.$define = {
  sort: function sort(options, subsObj, event) {
    var sorter = createSorter(options, subsObj)
    var moved = quickSort(this, 0, this.length, sorter, {})
    var hasChanged
    for(var m in moved) {
      var from = moved[m]
      var item = this[m]
      if(item.$key != m && item._$contextKey != m) {
        this.$handleShifted(m)
      }
      hasChanged = true
    }
    if(hasChanged) {
      this.emit('$change', event)
    }    
    return hasChanged && moved
  }
}


function createSorter(options, subsObj) {
  var key
  var order

  if(options instanceof Base) {
    key = (options.by && options.by.$val) || options.$val
    order = (options.order && options.order.$val) || 1
  } else {
    if(typeof options === 'object') {
      key = options.by
      order = options.order || 1
    } else {
      key = options
      order = 1
    }
  }

  var upsideDown = order !== 1

  if(typeof key === 'string') {
    if(subsObj) {
      var nestSub = {}
      nestSub[key] = true
      subsObj.set({
        any$: nestSub
      })
    }

    return upsideDown
      ? createFlippedCompByKey(key)
      : createCompByKey(key)

    // return function byKey(A, B) {
    //   A = A && A.$origin || A
    //   B = B && B.$origin || B
    //   var A = A && A[key] 
    //   var B = B && B[key]
    //   return compareValues(A, B) * order
    // }  
  } else {
    if(subsObj) {
      subsObj.set({
        any$: true
      })
    }

    return upsideDown
      ? flippedCompare
      : compare

    return function bySelf( A, B ) {
      return compareValues( A, B ) * order
    }
  }
}

function createCompByKey(key) {
  return function compareByKey(A,B) {
    A = A && A.$origin || A
    B = B && B.$origin || B
    var A = A && A[key] 
    var B = B && B[key]
    return compare(A, B)
  }
}
function createFlippedCompByKey(key) {
  var compareByKey = createCompByKey(key)
  return function(A,B) {    
    return compareByKey(A,B) * -1
  }
}

// TODO:
function compareByKeyNatural(A, B, key) {
  
}
function createCompByKeyNat(key) {

}
function createFlippedCompByKeyNat(key) {

}

function compare(A, B) {
  A = getSortValue(A)
  B = getSortValue(B)

  if(A && (!B && B !== 0)) {
    return -1
  }
  if((!A && A !== 0) && B) {
    return 1
  }

  return A < B 
    ? -1
    : A > B
      ? 1
      : 0
}
function flippedCompare(A, B) {
  return compare(A, B) * -1
}

// TODO:
function compareNatural(A, B) {

}

function getSortValue(val) {
  var result = val
  if(result) {
    result = result.$origin || result
    result = result.$val
    if(result === void 0) {
      result = val
    }
    if(result && result.toLowerCase) {
      result = result.toLowerCase()
    }
  }
  return result
}
