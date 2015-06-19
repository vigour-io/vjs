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
log('-----------THIS IS XX-------------')


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

  //also fires hello listener ?????
  xxxxx:true
})

log(xx.hello.$val)


// //zo fucked...
// //hello is nog niet geresolved

// log(xx.hello.$val)

// xx.hello.$val = 'murps'


// xx.$set({
//   bla:'hurky'
// })

// xx.hello.$val = 'gurk2'