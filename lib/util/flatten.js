module.exports = exports = flatten

function flatten (subject, separator) {
  var result = {}
  var acc = []
  var sep = separator || '/'

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
