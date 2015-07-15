var define = Object.defineProperty

var Base = require('../')

define(list, '_A_sort', {
  value: Array.prototype.sort
})

module.exports = function $sort(params, event) {

  console.log('sort it', params)

  var sortFn = typeof params === 'function' 
                ? params
                : makeSortFn(params)

  this._A_sort(sortFn)

  var length = this.length
  var changed
  for(var i = length-1 ; i >= 0 ; i--) {
    var item = this[i]
    if(item._$key !== i && item._$contextKey !== i) {
      changed = true
      this.$handleShifted(i)
    }
  }
  if(changed) {
    this.$emit('$change')
  }

  return this

}

function makeSortFn(params) {

  var key
  var order

  if(params instanceof Base) {

    key = (params.by && params.by.$val) || params.$val
    order = (params.order && params.order.$val) || 1
    console.log('kenker base params', key)
  } else {
    if(typeof params === 'object') {
      key = params.by
      order = params.order || 1
    } else {
      key = params
      order = 1
    }
  }

  console.log('?!?!?', key)

  if(typeof key === 'string') {
    console.log('SORT BY KEY', key)
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
