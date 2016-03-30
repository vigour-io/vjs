var ua = require('../../ua')
  , _prefix = '-'+ua.prefix.toLowerCase()
  , _transform = _prefix + '-transform'

exports.getMatrix = function(node) {
  if(node.style[_transform]) {
    var arr = window.getComputedStyle(node, null)
      .getPropertyValue(_transform).replace('matrix(', '').split(',')
    return arr
  }
}

// exports.hasCalc = function() {
//   var dummy = document.createElement('div')
//     , props = [ _prefix+'-calc', 'calc' ]
//     , i = props.length
//   while(i-1) {
//     dummy.style.cssText = 'width:' + props[i-1] + '(1px);'
//     if (dummy.style.length) return props[i-1]
//     i--
//   }
// }