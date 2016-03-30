require('./style.less')

var visible = require('../../../browser/events/visible')
var Element = require('../../../ui/element')
var app = require('../../../ui/app')

var x = new Element(
{ textholder:{h:40,w:800}
, tur:
  { css:'xholder'
  , w:800
  , h:200
  , scrollbar:'x'
  }
})

var Red = new Element(
{ display:'inline-block'
, css:'green'
, burf:
  { 'w,h,y,x':40
  , css:'blue'
  // , events:
  //   { visible:function(isVisible){
  //       if(isVisible){
  //         this.css = 'blue'
  //       }else{
  //         this.css = 'red'
  //       }
  //     }
  //   }
  }
}).Class

var i = 10
while(i--){
  var red = new Red(
  { w:~~(Math.random()*100+100)
  , h:~~(Math.random()*100+100)
  })
  x.tur.add(red)
}

app.set(
{ holder:
  { scrollTop:{val:100,animation:true}
  , scrollbar:'y'
  // , events:
  //   { scroll:function(){
  //       console.log('scrollevent')
  //     }
  //   }
  }
})

var i = 10
while(i--){
  app.holder.add(new x.Class({'tur.scrollLeft':app.holder.scrollTop}))
}

APP = app

// app.set(
// // { extraholder:
//   { 
//   //   scrollbar:'y'
//   // , h:500
//   // , 
//   holder:
//   { y:50
//   , a:
//     { scrollbar:'y'
//     , h:500
//     }
//   , b:
//     { scrollbar:'y'
//     , h:500
//     }
//   , scrollbar:'y'
//   , h:700
//   }
//   , textholder:{}
//   // }
// })

// var Red = new Element(
//   { display:'inline-block'
//   , css:'green'
//   , burf:
//     { 'w,h':40
//     , css:'green'
//     , events:
//       { visible:function(isVisible){
//           // console.log(isVisible)
//           if(isVisible) this.css = 'blue'
//           else this.css = 'red'
//         }
//       }
//     }
//   }).Class

// var i = 100
// while(i--){
//   var red = new Red(
//   { w:~~(Math.random()*100+100)
//   , h:~~(Math.random()*100+100)
//   })
//   app.holder.a.add(red)
// }

// var i = 100
// while(i--){
//   var red = new Red(
//   { w:~~(Math.random()*100+100)
//   , h:~~(Math.random()*100+100)
//   })
//   app.holder.b.add(red)
// }
