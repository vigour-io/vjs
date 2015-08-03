var log = require('../../dev/log')
var perf = require('../../dev/perf')
//-----------------------------------------------------

var Base = require('../../lib/base')

Base.prototype.inject( require('../../lib/methods/toString') )
//wil eigenlijk ook op constructors kunnen injecten

var Observable = require('../../lib/observable')

Observable.prototype.inject( 
  require('../../lib/operator/add'),
  require('../../lib/operator/filter'),
  require('../../lib/operator/map'),
  require('../../lib/operator/multiply')
)


log('smutch')

var mysmutch = new Observable({
  $key:'mysmutch',
  hurk:true
})

// mysmutch.set({
//   $on: {
//     $property: function(event, meta) {
//       log('FIRE PROP', JSON.stringify(meta))
//     }
//   }
// })

mysmutch.set({
  $on: {
    $change: function(event, meta) {
      log('FIRE change', JSON.stringify(meta))
    }
  }
})


// log('obs')

// var obs = new Observable({
//   $key:'obs',
//   $on: {
//     $change: function( event, meta ) {
//       //why does getting $key not work?
//       log( 'val change listener (from obs)', this.$path )
//     },
//     $property: function( event, meta ) {
//       log('val property listener (from obs)', JSON.stringify(meta), this.$path)
//     }
//   }
// })

// log('--- now log change and property ------')

// obs.set({
//   x:true
// })

// log('--- new instance - now log val (from obs) listener and property (from obs context bla)------')

// var bla = new obs.$Constructor({
//   $key:'bla',
//   marcus:'besjes',
//   $on: {
//     $change: {
//       speshField: function( event, meta ) {
//         log('speshField change listener (from bla)', event)
//       }
//     }
//   }
// })

// log('---references tests---')

// var a = new Observable({
//   $key:'a',
//   $val: 10
// })

// var b = new Observable({
//   $key:'b',
//   $val: 10,
//   $add: 10
// })

// console.warn('make c')

// var c = new Observable({
//   $key:'c',
//   $val: a,
//   $add: b,
//   $on: {
//     $change: function( event, meta ) {
//       // console.log('CHANGE!', this)
//       log('change from c', this.$path, this.$val)
//     },
//     // $new: function( event, meta ) {
//     //   // log( 'new instance!', 'current instance:', this.$path, 'from:', meta.$path )
//     // }
//   }
// })

// log(c.$val) 

// log('-- update a---- (c should update)')

// // console.clear()

// a.$val = 20

// // debugger
// // console.clear()

// log('--d new instance of c expect c to fire (context d) (since set /w key)')
// // //think about this maybe key should not update?

// console.warn('make d')

// // //nu word d2x gecalled omdat bound niet word beijgehouden in dingen die geexclude moeten
// // //worden mischien toch in de emitter?
// // //anders is er geen difference...


// //   setup
// //   bind word een array
// //   word altijd meegenomen in stamp
// //   $emit in emitter is responsible voor het uitvoeren van multiple bound things
// //   (dus exec met different bound)

// //   __bind__ is altijd array ( for now )

// //   emitter emit doet exec op multiple --- $emit van obs is wel responsible voor het added?

// //   //ook niet called alleen emit nog een keer!




// try {


// //use uid system for this
// //since d has and update from c and one of its own
// //this will break it

// var d = new c.$Constructor({
//   $key:'d',
//   $on: {
//     $change: {
//       //now this is unique so it will work
//       flups:function(){
//         //moet nog checken of een instance eigen onFn heeft
//         log('flups', this.$path)
//       }
//     }
//   }
// })

// } catch(e) {
//   console.error(e.stack)
// }

// // console.clear()
// log('update a, expect d and c to fire, fulps as well (context d)')
// a.$val = 30

// log('--e new instance of d, fire c context e, flups (context e)')

// console.warn('make e')

// var e = new d.$Constructor({
//   $key:'e',
//   $add:100
// })


// log('--- change a ref fire c context c,d,e ---, flups (context e,d)')

// a.$val = 40


// log('--- change b ref fire c context c,d, NO e ---, flups (context e,d)')

// b.$val = 40





//test overwriting the instance
//test base (not doing instances)