var log = require('../../dev/log')
var perf = require('../../dev/perf')
//-----------------------------------------------------

var Base = require('../../lib/base')

var bla = window.b = new Base({
  gurken:true
})

Base.prototype.inject( require('../../lib/methods/toString') )

window.bb = Base

bla.inject(function(base) {
  console.log('ghello!', base)
  base.define({
    murderballs: function() {

    }
  })
})

var obj = {
  $: {
    define: {
      marcus: function() {
        console.log('murderballs')
      }
    }
  }
}

bla.inject( obj )

bla.inject( obj )

var blurf = new bla.$Constructor({
  myblurfi:true
})

blurf.inject(obj)

blurf.inject(require('../../lib/methods/each'))

var gurk = new blurf.$Constructor({
  $: {
    inject: require('../../lib/methods/each')
  }
})

gurk.each(function(property, key) {
  console.log('going trough mofo gurk key:', key)
})

var murderballs = new Base({
  $inject: [ 
    require('../../lib/methods/find'), 
    require('../../lib/methods/map'),
    require('../../lib/methods/filter') 
  ],
  murderballsextreme: true,
  flups: false,
  marcus: 'extreme'
})

console.log(murderballs.map(function(property) {
  console.log(property)
  return property._$val ? 'yeah' : 'nope'
}))

console.log(murderballs.filter( 'extreme' ))

var Observable = require('../../lib/observable')

var obs = new Observable({
  $key:'obs',
  $on: {
    $change: function( event, meta ) {
      //why does getting $key not work?
      log( 'fire obs event', this.$path )
    },
    $property: function( event, meta ) {
      log('fire prop:', JSON.stringify(meta), this.$path)
    }
  }
})

obs.set({
  x:true
})

var bla = new obs.$Constructor({
  $key:'bla',
  marcus:'besjes',
  $on: {
    $change: {
      mups: function( event, meta ) {
        log('wtf wtf wtf', event)
      }
    }
  }
})

log('------')

bla.set({
  nee:true
})

// var bla = obs.$Constructor({
//   $key:'bla',
//   marcus:'besjes'
// })

window.obs = obs

log('--operators n shit-----')

var gurk = new Observable({
  $inject: require('../../lib/operator/add'),
  $val:10,
  $add:20
})

log(gurk.$val)

console.error('--------')

var blurf = new Observable({
  $inject: [
    require('../../lib/operator/add'),
    require('../../lib/operator/filter'),
    require('../../lib/operator/map'),
    require('../../lib/operator/multiply')
  ],
  marcus:true,
  $add:{
    jim:true
  }
})


console.log('--------')

log(blurf.$val)

console.log(blurf.toString())
// log('---crash it (set a method)---')

// blurf.set({
//   marcus:100
// })


