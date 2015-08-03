var Observable = require('../../../lib/observable')

var a = window.aa = new Observable({
  $key:'a',
  $val: 1,
  $on: {
    $change: {
      // val as a key
      a: function( event, delta ) {
        console.log('a change!', this, event, delta )

        // event.$postponed = null
        // this.set( Math.random()*9999, event )
      },
      b: function( event, delta ) {
        console.log('whats happening????', event)
      }
    },
    // $property: function( event, delta ) {
    //   console.log('property change!', delta)
    // },
    // $value: function( event, delta ) {
    //   console.warn('changing value!', event, this, delta)
    // }
  }
})

var b = new Observable({
  $val: a,
  $on: {
    $change: function( event, delta ) {
      console.log('hey im changing b!!!!')
    },
    $reference: function( event , delta ) {
      console.log('im changing b to a ref', this._$val, delta)
    }
  }
  // each:'xxx'
})


var aFunction = function( event, meta, thisisB, anotherArg ) {
  console.error('hey !!!!!', thisisB, anotherArg )
}

a.set({
  $on: {
    $change: {
      a: [ aFunction , 'xxx', 'weewwe' ],
      b: [ aFunction , b, 'weewwe' ]
    }
  }
})


function xxx() {
  console.log('xxxx')
}

b.on('$change',xxx )

b.on('$change', function() {
  console.log('xxxx2')
}, 'shawn' )


//off is nice

//val
b.off('$change', 'shawn' )
console.log( b.$on.$change )

b.$val = false
b.$val = 'xxx'
// b.$val = a

console.log('!!hey!!!')

a.$val = 'ghello! 21321'



b.remove()

console.log(a.$on.$change)