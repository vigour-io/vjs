var Base = require('../../../lib/base')

var a = new Base({
  $key:'a',
  b: {
    c: {
      d: {
        e:true
      }
    }
  }
})

var aInstance = new a.$Constructor({
  $key:'aInstance'
})

// have to set b
// do i have b
//   yes 
//     is is my own?
//       yes -- .set on b
//       no -- create new b( setobj )

var aInstance2 = new a.$Constructor({
  $key:'aInstance2',
  b: {
    newField: true
  }
})


console.log( a.b.c.$path )
console.log( aInstance.b.c.$path )
console.log( aInstance2.b.c.$path )

console.log( 
  'A INSTANCE',
  aInstance.b.c.$path,
  aInstance.b.c._$context, 
  aInstance.b.c._$contextLevel
)

console.log( 
  'AINSTANCE 2 -- with his own b property',
  aInstance2.b.c.$path,
  aInstance2.b.c._$context, 
  aInstance2.b.c._$contextLevel
)

console.log(aInstance2.b instanceof a.b.$Constructor)


console.warn('--- now into newA ----')

var resolver = Base.prototype.$resolveContextSet

Base.prototype.define({
  $resolveContextSet: function() {
    console.log('im resolving!', this.$key)
    return resolver.apply(this, arguments)
  }
})

var newA = new Base({
  $key:'newA',
  hello:{
    bye:true
  }
})

var Contructor = newA.$Constructor

console.log(newA)

var newAInstance = new Contructor({
  $key:'newAInstance'
})

/*
  get hello
  is it newA?
    yes return hello and clear possible context
    no return hello set hello context to newAInstance 
*/

console.log(newAInstance.hello)


var hello = newAInstance.hello

newAInstance.hello.$clearContext()

console.log(hello.$path)



/*
  newA.hello.to.be.ok
  newAInstance.hello.to.be.null
*/




describe('contexts and stuff...', function() {

  it('im removing newAInstance.hello', function() {
    console.warn('im going to remove newAInstance hello.bye')

    expect( Object.getPrototypeOf( newAInstance.hello ) )
      .to.equal( Base.prototype )

    newAInstance.hello.bye.remove()

    expect(newAInstance.hello.bye).to.be.null
    expect(newA.hello.bye).to.be.ok

    //if this is true
    expect(newAInstance.hello).to.be.instanceof( newA.hello.$Constructor )

    //then this can never be true!
    expect( Object.getPrototypeOf( newAInstance.hello ) )
      .to.not.equal( Base.prototype )

    expect( Object.getPrototypeOf( newA.hello ) )
      .to.equal( Base.prototype )

  })

})

console.clear()
var Observable = require('../../../lib/observable')


var fn = Observable.prototype
  .$generateConstructor.apply(Observable.prototype, arguments)



var a = new Observable({
  $key:'a',
  $define: {
    $generateConstructor: function() {
      function speshFunction() {
        console.log('hello!')
        fn.apply(this, arguments)
      }
      return speshFunction
    }
  },
  $on: {
    $new: function() {
      console.log('new a!', this.$key)
    }
  }
})




var b = new a.$Constructor({
  $key:'b'
})