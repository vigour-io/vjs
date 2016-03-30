var matrix = require('../element/properties/util').getMatrix
  , vigour = require('../../')
  , css = require('../css')

exports.left = exports.x = function ( object, arr ) {
  return offset(object,arr,'left','offsetLeft', 4)
}

exports.top = exports.y = function ( object, arr ) {
  return offset(object,arr,'top','offsetTop', 5)
} 

function offset ( object, arr, prop, propL, matrixIndex ) {
  if(!object) return 0
  var start = false
  if(!arr) {
    arr = []
    start = true
  }
  
  if(vigour.Element && object instanceof vigour.Element) object = object.node

  var amount = object[propL]
    , temp = 0
  if(typeof(amount) !== 'number') amount = 0
  if(object.parentNode) exports[prop](object.parentNode, arr)
    if( ( (object.style && object.style.position)
      ||object.__preCss
      ||object.className 
        && (object.__preCss = css(object.className, 'position')||true)) 
      !== 'absolute' ) {
        arr.push(['rel', amount])
    } else {
      var matrixArray = matrix(object)
      arr.push(['abs', matrixArray 
        ? parseInt(matrixArray[matrixIndex],10)+amount //normal amount as well
        : amount ])
    }
  
  if(start) {
    var lastrel
      , abs = 0
      , i
    for(i in arr) {
      if(arr[i][0] == 'abs') {
        abs += arr[i][1]
      } else {
        lastrel = arr[i][1]
      }
    }
    amount = arr[arr.length - 1][0] === 'rel' ? abs+lastrel : abs
  }
  return amount || 0
}

  


