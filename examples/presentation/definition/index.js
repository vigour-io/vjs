var Observable = require('../../../lib/observable')


var observable = Observable.prototype

/*
observable.inject(
  require('//')
)
*/


var setObj = {
  x: true
}

var a = new Observable(setObj)
a.$set( setObj )
a.$val = setObj

var iNeedThisModule = {
  $define: {
    $anotherMethod: function() {

    }
  }
}

var aObservable =  new Observable({
  $define: {
    $set: function() {
      console.log('hello!')
      return Observable.prototype.$set.apply(this, arguments)
    }
  }
})

aObservable.define({
  $ChildConstructor: aObservable.$Constructor
})

var aModule = function( base ) {
  var setMethod = base.$set
  var setobj = {
    $define: {
      $set: function(val) {
        console.log('hello! amodule', val)
        return setMethod.apply(this, arguments)
      },
      $specialMethod: function() {
        console.log( this )
      }
    },
    $flags: {
      andrew: function( val, event ) {
        this.$emit('andrew', event )
        console.log('its an andrew flag', arguments)
      },
      aObservable: aObservable
    },
    $inject: [ iNeedThisModule ]
  }
  base.$set(setobj)
}


var b = new Observable({})
b.inject( aModule )

b.$set({
  hello:true,
  $on: {
    andrew:function( event ) {
      console.log('fire andrew!', event)
    }
  }
})

b.$val = {
  andrew:'?????',
  xxxx:true,
  aObservable: {
    shawn: true
  }
}

// b.andrew = 'xxx'

console.log( b.aObservable )
console.log( b.aObservable.shawn instanceof aObservable.$Constructor )


