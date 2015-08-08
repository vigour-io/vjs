var s = {
  title: 'margin: 5px; color:blue; font-size: 16pt'
}

// ==============================

var define = Object.defineProperty

var Observable = require('../../lib/observable')
var SubsEmitter = require('../../lib/observable/subscribe/emitter')

// ==============================

var reffed = new Observable({
  inreffedKEY: 'inreffedVAL'
})

var ding1 = new Observable({
  key1: 'val1',
  ref: reffed,
  $on: {}
})
ding1.$key = 'rootding'

var subsEmitter = new SubsEmitter({
  hopla: function(event, meta) {
    console.error('SUBSEMITTER HANDLER FIRED!', meta)

    console.group()
    console.log('this:', this, '\n')
    console.log('meta:', meta, '\n')
    console.groupEnd()
  },
  $pattern: {
    ref: { inreffedKEY: true }
    // any$: true
  }
}, false, ding1.$on )

ding1.set({
  $on: {
    durps: subsEmitter
  }
})

console.log('%c-------------- change 1!', s.title)
reffed.inreffedKEY.$val = 'changevalinreffed'

console.log('%c-------------- change no more ref!', s.title)
ding1.ref.$val = 15
// ding1.ref.$val = { inreffedKEY: 'spurk!', $val: undefined }


