'use strict'

// module.exports = function find(property, mapvalue) {
//   if (mapvalue === true) {
//     return property
//   }
//   for (var i in mapvalue) {
//     let value = mapvalue[i]
//     if (value) {
//       let next = property[i]
//       if (next) {
//         return find(next, value)
//       }
//     }
//   }
// }

// module.exports = function find(property, mapvalue, key) {
//   if(key && property._context){
//     console.log('BENG', property)
//   }
//   for (let i in mapvalue) {
//     let value = mapvalue[i]
//     if (value) {
//       let next = property[i]
//       if (next) {
//         return find(next, value, property.key)
//       }
//     }
//   }
// }

//TODO total bs
module.exports = function find (property, mapvalue, path) {
  if (mapvalue === true) {
    let pattern = property.pattern
    if (pattern._context) {
      let i = path.length - 1
      pattern.resolveContext({})
      for (; i >= 0; i--) {
        pattern = pattern[path[i]]
      }
    }
    return pattern
  }
  for (let i in mapvalue) {
    let value = mapvalue[i]
    if (value) {
      let next = property[i]
      if (next) {
        if (i === 'parent') {
          path.push(property.key)
        } else {
          path.push('sub_parent')
        }
        return find(next, value, path)
      }
    }
  }
}
