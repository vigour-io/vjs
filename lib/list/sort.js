var define = Object.defineProperty

define(list, '_A_sort', {
  value: Array.prototype.sort
})

module.exports = function $sort(params, event) {

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
  if(typeof params === 'object') {
    key = params.by
    order = params.order || 1
  } else {
    key = params
    order = 1
  }

  if(key) {
    return function byKey(A, B) {
      var A = A && A[key] 
      var B = B && B[key]

      A = A && A.$val
      B = B && B.$val

      if(A && A.toLowerCase) A = A.toLowerCase()
      if(B && B.toLowerCase) B = B.toLowerCase()

      var result = A < B 
                    ? -1
                    : A > B
                      ? 1
                      : 0
      
      return result * order

    }  
  } else {
    return function bySelf(A, B) {
      A = A && A.$val
      B = B && B.$val
      if(A && A.toLowerCase) A = A.toLowerCase()
      if(B && B.toLowerCase) B = B.toLowerCase()

      var result = A < B 
                    ? -1
                    : A > B
                      ? 1
                      : 0
      
      return result * order
    }
  }
}
