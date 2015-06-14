//index.js
// var isNode = (typeof window === 'undefined')

// if(!isNode) {
//   document.body.style.fontFamily = 'andale mono'
//   document.body.style.fontSize = '12px'
//   document.body.style.lineHeight = '11px'
//   window.gc()
//   console.log = function() {
//     document.scrollTop = -document.scrollHeight;
//     var line = document.createElement('hr')
//     document.body.appendChild(line)
//     for(var i in arguments) {
//       var arg = document.createElement('div')
//       arg.style.backgroundColor = '#eee'
//       arg.style.padding = '5px'

//       arg.innerHTML = typeof arguments[i] === 'string' 
//         ? arguments[i].replace(/(\r)|(\n)/g,'<br/>').replace(/ /g,'&nbsp;')
//         : arguments[i]
//       document.body.appendChild(arg)
//     }
//   }
//   // document.body.appendChild(arg)
// }

//-------------------------------------------------------------

var Base = require('../../lib/base')

var bla = new Base({
  x:{
    y:{
      z: 'bla'
    }
  },
  flups:'bla'
})
bla._name = 'bla'

var blurf = window.blurf = new bla.$Constructor({
  flups:'blurf'
})

blurf._name = 'blurf (instanceof bla)'

console.log( blurf.$path, blurf.x.y.z.$path )
