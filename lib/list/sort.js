var Base = require('../base')
var quickSort = require('../util/quicksort')

exports.$define = {
  sort: function sort(options, subsObj, event) {
    
    var sorter = makeSorter(options, subsObj)
    var moved = quickSort(this, 0, this.length, sorter, {})

    console.log('ok sorted! moved:', moved)

    var hasChanged
    for(var m in moved) {
      var from = moved[m]
      var item = this[m]
      if(item._$key != m && item._$contextKey != m) {
        this.$handleShifted(m)
      }
      hasChanged = true
    }
    if(hasChanged) {
      this.$emit('$change')
    }

    return this

  }
}

function makeSorter(options, subsObj) {
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

  if(typeof key === 'string') {
    if(subsObj) {
      var nestSub = {}
      nestSub[key] = true
      subsObj.$set({
        any$: nestSub
      })
    }
    return function byKey(A, B) {

      A = A && A.$origin || A
      B = B && B.$origin || B

      var A = A && A[key] 
      var B = B && B[key]

      A = getSortValue(A)
      B = getSortValue(B)

      if(A && !B) {
        return -1 * order
      }
      if(!A && B) {
        return 1 * order
      }

      var result = A < B 
                    ? -1
                    : A > B
                      ? 1
                      : 0
      
      return result * order

    }  
  } else {
    if(subsObj) {
      subsObj.$set({
        any$: true
      })
    }
    return function bySelf(A, B) {
      A = getSortValue(A)
      B = getSortValue(B)

      if(A && !B) {
        return -1 * order
      }
      if(!A && B) {
        return 1 * order
      }      

      var result = A < B 
                    ? -1
                    : A > B
                      ? 1
                      : 0
      
      return result * order
    }
  }
}

function getSortValue(val) {
  val = val && val.$origin || val
  val = val && val.$val
  if(val && val.toLowerCase) {
    val = val.toLowerCase()
  }
  return val
}
