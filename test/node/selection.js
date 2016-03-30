var data = require('../../data')
  , selection = require('../../data/selection')
  // , test = require('../../util/test')

// exports.testData = new data(
//   test.data({  
//       array:{val: {
//         name:test.text(10,true),
//         description:function(i) {
//           return i
//         }
//       },
//       length:10000
//     }
//   })
// )

// test('selection',function() {
//   exports.selection = new data(exports.testData.array,{
//     condition: {
//       name: {
//         $contains:"hur"
//       }
//     }
//   })
// })

// exports.selection.addListener(function(val, stamp, from, remove, added, oldval){
//   console.log('something changed in tsel!')
//   if(remove) console.log('REMOVE:', remove && remove.raw)
//   if(added) console.log('ADDED:', added && added.raw)
//   // console.log('stamp', stamp);
//   // console.log('from', from.raw);
// })

// console.log('selection.length:', exports.selection.length)

// exports.selection.filter = {
//   condition:{
//     name:{$contains:'fulknur lol echtniet dit zit er niet in'}
//   }
// }

// var str = '_'
// exports.selection.each(function(){
//   str += 'F'
// })

// console.log('selection.length:', exports.selection.length
//            , '\n', str
//            )

var tdata = new data(
  { a:{ f:1 }
  , b:{ f:2 }
  , c:{ f:3 }
  , d:{ f:4 }
  , e:{ f:5 }
  }
)

var tsel = new data(tdata,
  {condition:{ f:2 }}
)

// tsel.addListener(function(val, stamp, from, remove, added, oldval){
//   // console.log('something changed in tsel!')
//   if(remove) console.log('REMOVE:', remove && remove.raw)
//   if(added) console.log('ADDED:', added && added.raw)
//   // console.log('stamp', stamp);
//   // console.log('from', from.raw);
// })

tsel.each(function(){
  console.log('1111')
  console.log('->', this.raw)
})

console.log('------------------------ 1 got tsel:\n', tsel.raw)

// tsel.filter = {
//   condition:{
//     f:{$gt:1}
//   },
//   range:2
// }

// console.log('------------------------ 2 got tsel:\n', tsel.raw)

// tsel.filter = {
//   condition:{
//     f:{$gt:2}
//   },
//   range:2
// }

// console.log('------------------------ 3 got tsel:\n', tsel.raw)

// tsel.filter = {
//   condition:{
//     f:{$gt:2}
//   },
//   range:2,
//   sort:{
//     field:'f',
//     order: true
//   }
// }

// console.log('------------------------ 4 got tsel:\n', tsel.raw)
