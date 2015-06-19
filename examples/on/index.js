var log = console.log = require('../../lib/util/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

//-------------------------------------------------------------

log('lets do this!')


var perf = require('../../lib/util/perf')

//-------------------------------------------------------------

console.clear()

var bla = new Base({
  $key:'bla',
  hello:{
    //this yes allready gets executed.. object before 
    //val is after fields ? flags should go first...

    //try to ignore $on.$change first set
    $val:'yes',

    //dit moet niet executen
    $on: {
      $change:function( event ) {
        console.error('THIS???', this, this.$path, event.$val)
        log('LISTENER FIRES - HELLO LISTENER! -', '$path:',this.$path, '$val:', this.$val, 'event:', event.$toString() )
      }
    }
  }
})

//-------------------------------------------------------------

// log(bla)

console.info('\n\nthis is setting hello')

log('-----------THIS ScHOULD BE HELLO!-------------')

bla.hello.$val = 'no'

// log(bla)

// //-------------------------------------------------------------

console.info('\n\nthis is xx')
log('-----------THIS IS XX------------- should get a listener (hello is changing)')


var xx = new bla.$Constructor({
  $key:'XX',
  //hierover nadenken wil je dat ie hiervoor fired?

  //prop wel denk aan e.g. x
  hello: 'GURK!',

  //hello is nog niet geresolved door de on path is goed maar target is off!

  //now what hard is changing listers and making sure they dont overwrite
  //also other things then listener but just other values imporant for e.g. references!

  $on:{
    $change:function(event) {
      log('LISTENER FIRES - XX LISTENER -', this.$path, 'event:', event.$toString())
    }
  }
})


//added is ngo super iffy als event
//moet beter gehandeked worden

//e.g. added is alleen maar valid als het added is voor het even
//added houd bij?
//add is never voor nieuwe dingen internaly (e.g.) new bla({x,y}) als dit internal gebeurd

log('-----------now im just setting xx-------------')

xx.$set({
  xxxxx:true
})

// log(xx.hello.$val)

log('-----------references-------------')


//dit heeft de listens array nodig (autoclean)

var murder = new Base({
  $key:'murder',
  a:'a',
  c:'c'
})

var a = murder.a
var c = murder.c

//meeste nieuwe hoeven niks met updates te doen dnek ik?
//ugh x 

var b = new Base({
  $key:'b',
  $val:a,
  $add:c,
  $on: {
    $change:function(event) {
      log('REF CHANGE!', event, this.$val)
    }
  }
})

// log('hello')

var d = new Base({
  $key:'d',
  $val:b,
  $add:b,
  $on: {
    $change:function(event) {
      log('REF CHANGE D!', event, this.$val)
    }
  }
})

var e = new Base({
  $key:'e',
  $val:d,
  $add:{ $val: d, $add: b },
  $on: {
    $change:function(event) {
      log('REF CHANGE E!', event, this.$val, 'MY PATH:', this.$path)
    }
  }
})

// //!!!!
// //eerste grote extra ding is instances gaan handelen
// //dit doet nu nog niks -- een handeler hij heeft schijt aan instances

//dit zou een change moeten forcen -- doe iets ook
//met als origin eInstance (key word geset en listener op change en ik set key$)
var eInstance = new e.$Constructor()
eInstance._$key = 'eInstance'

// //fix de context

//!!!!

console.info('0000000')
log('update a')

a.$val = 'aa'


// console.clear()


log('multi update')
console.info('0000001')


murder.$set({
  a:'aaa',
  c:'cc'
})



// log(b.$val)


// var a = new Base('a')
// var b = new Base('b')

// var bla = new Base({
//   gurk: {
//     $val:{$useVal:a},
//     $add:b
//   },
//   $on:{
//     $change:function(event) {
//       log('hey im changing!', this.gurk.$val, event.$toString())
//     }
//   }
// })

// bla.$set({
//   g:10,
//   gurk: {
//     $add:10,
//     $val:20
//   }
// })

// log('-----------the nested merge test-------------')


// //zo fucked...
// //hello is nog niet geresolved

// log(xx.hello.$val)

// xx.hello.$val = 'murps'


// xx.$set({
//   bla:'hurky'
// })

// xx.hello.$val = 'gurk2'