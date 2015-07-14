var log = console.log = require('../../lib/dev/log')

//-------------------------------------------------------------

var Base = require('../../lib/base')

//-------------------------------------------------------------

log('lets do this!')

var perf = require('../../lib/dev/perf')

//-------------------------------------------------------------

// console.clear()

var bla = new Base({
  $key:'bla',
  hello:{
    //this yes allready gets executed.. object before 
    //val is after fields ? flags should go first...
    //try to ignore $on.$change first set
    $val:'yes',
    //dit moet niet executen
    $on: {
      // $socketIncoming:
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

log('--stamp should become 14----')

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
  $add:{ $val: d, $add: b }
})

//!!!!
//eerste grote extra ding is instances gaan handelen
//dit doet nu nog niks -- een handeler hij heeft schijt aan instances

//dit zou een change moeten forcen -- doe iets ook
//met als origin eInstance (key word geset en listener op change en ik set key$)
var eInstance = new e.$Constructor()
//dit is het ding nu moeten er meer updates worden gerunt

//chnage dispatcher krijgt ding om te kijken of $val echt gechanged is
//caching word veel midner complex

//e.g x is gewoon een useVal ding op element met een change listener simple solid smooth

eInstance._$key = 'eInstance'

//arghhh instances! so hard!


  //defualt blijven listeners bestaan maar niet base listeners


  //verzin hoe dispacther dit te latne doen zonder slow te worden


  //listens


  //maak 3 losse arrays 

    //functions (basic)
    //funcitons + bind
    //bases

  //los van dispatcher --- listens
    //bases (pure)
    

    //bound methods -- supe chill om die in een listens array te kunnen doen
    //multiple info opslaan


    //je kan als je een + bind doet



// //fix de context

//!!!!

console.info('0000000')
log('update a')

a.$val = 'aa'


// console.clear()

log('multi update')
log('--stamp should become 15----')

console.info('0000001')


var bla = new Base({
  x:a,
  y:a,
  $key:'marcus',
  $map: function(field) {
    return { 'ITSAKEY!': field._$key, x:a }     
  }
})

log('--stamp should become 16----')

murder.$set({
  a:'aaa',
  c:'cc',
  //map ff wat beter
  //filter als operator!!! fuck yeah killers
  //find als operator
  //toch op default $val object terug sturen?
  //o yeah the solution for filters

  // $transform:function( val ) {
  //   var arr = []
  //   this.$each(function(field, key) {
  //     if(key[0] === 'a') {
  //       arr.push(field)
  //     }
  //   })
  //   return arr
  // },
  $condition: {

  },
  $map:function( field, key ) {
    var obj = {}
    //val moet eigenlijk de prev value zijn :/
    obj.val = field.$val
    obj.key = field._$key
    return obj
  },
  $add:bla, //'marcus',
  $on: {
    $change:function() {

      log('fire Listeners', 
        this.$val
      )

      // console.warn('hello!', this.$val, false, 2)
    }
  }
})

// console.warn(murder.$val)

murder.$set({
  yuzi:true,
  abba:'xxx'
})

murder.$set({
  james:true,
  ax:'this is ax'
})

murder.$set({
  blurf:true,
  aap:'aap!'
})


var bla = new Base({
  a:'a',
  b:'b',
  $key:'blablabla'
})

var selection = new Base({
  $val:bla,
  $map:function(field) {
    if(field.$val === 'a') {
      return { haha: field, randomdweepish: Math.random()*99999 }
    }
  }
})

log('selection', selection.$val.$toString())


bla.$set({
  a:'b',
  b:'a',
  // $key:'BLABLA',
  // $add: {
  //   gurk: {
  //     $x:10, //x,y zijn wel properties...
  //     $y:10,
  //     $text:{$BindAndlistenOnField:'$up.$data'}
  //   },
  //   kul: {
  //     text:'bla'
  //   }
  //   // $transform:function(val) {
  //   //   if(night) return val
  //   // }
  // },
  $transform: {
    //if(operator null e.g $has)
    blur:10,
    x:20,
    y:20
    // $has: bla.x //operator for truthy/falsy
  }
})

var xx = new bla.$Constructor({
  $key:'blaInstance',
  $transform: {
    //dit gaat helemaal mis maakt een ref naar $transform
    blurk:1000,
    x:'HELLO!'
  }
})

log( 'bla', bla.$val, 'normal', bla, 'transform', bla.$transform )

log( 'xx', xx.$val, 'normal', xx, 'transform', xx.$transform )

//find a way to listen to xx.$val (faster ofcourse)
//problem now is that it gets a false on it since its not rly an update ever..
//however we may need to set stamp in objects -- so its clear what a $val update come from
//or handle eveyrhting in results -- at least find something
//maybe pass event as well on $val
// log(murder.$val)

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

// perf(function() {
//   for(var i = 0 ; i < 1000000; i++) {
//     murder.$each(function(e) {
//       var bla = e
//     })
//   }
// })