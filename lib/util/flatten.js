module.exports = exports = flatten

/**
 * @function Take a nested Javascript object and flatten it
 * @param  {object} - Object that needs to be flattened
 * @param  {string} - Optional seperator sign
 * @return {object} - Flattend Object
 */

function flatten (subject, separator) {
  var result = {}
  var acc = []
  var sep = separator || '.'

  function traverse (obj) {
    var key
    for (key in obj) {
      acc.push(key)
      if (typeof obj[key] === 'object') {
        traverse(obj[key])
      } else {
        result[acc.join(sep)] = obj[key]
      }
      acc.pop()
    }
  }

  traverse(subject)
  return result
}
