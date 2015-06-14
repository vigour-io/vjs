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
bla._$key = 'bla'

var blurf = window.blurf = new bla.$Constructor({
  flups:'blurf',
  // x: {
  //   extraField:true
  // }
})

blurf._$key = 'blurf (instanceof bla)'

console.log('---- this is my test ----')

//dit is kut --- y,z nog geen getters dus dit werkt never
//proberen getters overal te doen? (nested dingen)
console.log( blurf.x.y.z.$path, '<---- my path' )

var gurk = window.gurk = new blurf.$Constructor({
  flups:'gurk'
})

gurk._$key = 'gurk'

//overwrite!
console.log( gurk.x.y.z.$path, '<---- my path' )

var hurk = window.gurk = new blurf.$Constructor({
  flups:'hurk'
})
hurk._$key = 'hurk'

console.log( hurk.x.y.z.$path,  '<---- my path' )

console.log(' setting a inheritable prop on blurf' )

blurf.$set({
  bitchez:{
    aint:'shit'
  }
})

console.log(gurk.bitchez.$toString(), gurk.bitchez.aint.$path)



