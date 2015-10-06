'use strict'

module.exports = {
  /**
   * Wraps the filter function in plain and flatten methods
   * @param  {Function} fn    The filter function
   * @return {Function}       The wrapped function
   */
  wrapFilterFn: function filterWrap (fn) {
    if (!fn) {
      return void 0
    }
    return function (val, key, base) {
      if (base && base.properties[key]) {
        return false
      }
      return fn(val, key)
    }
  }
}
